import { NextResponse } from "next/server";
import { getStripe, hasStripe } from "@/lib/stripe";
import type { OrderItem } from "@/lib/orders";
import { calcOrderFees } from "@/lib/order-fees";

export const dynamic = "force-dynamic";

function isValidPhone(phone: string) {
  return /^[+0-9\s()-]{9,20}$/.test(phone.trim());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = String(body.customerName || "").trim();
    const customerPhone = String(body.customerPhone || "").trim();
    const customerAddress = String(body.customerAddress || "").trim();
    const note = String(body.note || "").trim();
    const fulfillment =
      body.fulfillment === "delivery" ? "delivery" : "pickup";
    const deliveryZoneId = String(body.deliveryZoneId || "");
    const items = (Array.isArray(body.items) ? body.items : []) as OrderItem[];

    if (!customerName || customerName.length < 2) {
      return NextResponse.json({ error: "Zadejte jméno." }, { status: 400 });
    }
    if (!isValidPhone(customerPhone)) {
      return NextResponse.json(
        { error: "Zadejte platný telefon." },
        { status: 400 },
      );
    }
    if (!items.length) {
      return NextResponse.json({ error: "Košík je prázdný." }, { status: 400 });
    }
    if (fulfillment === "delivery" && customerAddress.length < 5) {
      return NextResponse.json(
        { error: "Zadejte adresu doručení včetně obce." },
        { status: 400 },
      );
    }

    const normalized = items.map((i) => ({
      name: String(i.name).slice(0, 120),
      unitPrice: Number(i.unitPrice),
      qty: Number(i.qty),
    }));

    for (const item of normalized) {
      if (
        !item.name ||
        item.qty < 1 ||
        item.unitPrice < 0 ||
        Number.isNaN(item.unitPrice)
      ) {
        return NextResponse.json(
          { error: "Neplatné položky objednávky." },
          { status: 400 },
        );
      }
    }

    const itemsTotal = normalized.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const itemCount = normalized.reduce((s, i) => s + i.qty, 0);
    const fees = calcOrderFees({
      itemsTotal,
      itemCount,
      fulfillment,
      deliveryZoneId,
      customerAddress,
    });
    if (fulfillment === "delivery" && !fees.deliveryZone) {
      return NextResponse.json(
        {
          error:
            "Z adresy nepoznáme zónu rozvozu. Doplňte obec (např. Vinoř, Kbely, Letňany).",
        },
        { status: 400 },
      );
    }

    if (itemsTotal < 1) {
      return NextResponse.json({ error: "Neplatná částka." }, { status: 400 });
    }
    if (!fees.meetsMinOrder) {
      return NextResponse.json(
        {
          error: `Minimální objednávka pro ${fees.deliveryZone?.name} je ${fees.minOrder} Kč.`,
        },
        { status: 400 },
      );
    }

    if (!hasStripe()) {
      return NextResponse.json({
        mode: "mock",
        itemsTotal,
        packagingFee: fees.packagingFee,
        deliveryFee: fees.deliveryFee,
        total: fees.total,
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe není nastavené." },
        { status: 500 },
      );
    }

    const intent = await stripe.paymentIntents.create({
      amount: fees.total * 100,
      currency: "czk",
      automatic_payment_methods: { enabled: true },
      metadata: {
        customerName,
        customerPhone,
        customerAddress: customerAddress.slice(0, 200),
        note: note.slice(0, 400),
        fulfillment,
        deliveryZoneId,
        packagingFee: String(fees.packagingFee),
        deliveryFee: String(fees.deliveryFee),
        itemsTotal: String(itemsTotal),
        items: JSON.stringify(normalized).slice(0, 450),
      },
      description: `Dal Birbante – ${customerName}`,
    });

    return NextResponse.json({
      mode: "stripe",
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      itemsTotal,
      packagingFee: fees.packagingFee,
      deliveryFee: fees.deliveryFee,
      total: fees.total,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Platbu se nepodařilo připravit." },
      { status: 500 },
    );
  }
}
