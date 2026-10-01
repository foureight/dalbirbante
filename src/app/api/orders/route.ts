import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createOrder,
  listOrders,
  updateOrder,
  type OrderItem,
} from "@/lib/orders";
import { calcOrderFees } from "@/lib/order-fees";
import { getStripe, hasStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
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
    const paymentIntentId = body.paymentIntentId
      ? String(body.paymentIntentId)
      : "";
    const mockPay = Boolean(body.mockPay);

    if (!customerName || !customerPhone || !items.length) {
      return NextResponse.json(
        { error: "Neúplná objednávka." },
        { status: 400 },
      );
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
    const itemsTotal = normalized.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const fees = calcOrderFees({
      itemsTotal,
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

    if (!fees.meetsMinOrder) {
      return NextResponse.json(
        {
          error: `Minimální objednávka pro ${fees.deliveryZone?.name} je ${fees.minOrder} Kč.`,
        },
        { status: 400 },
      );
    }

    if (hasStripe()) {
      if (!paymentIntentId) {
        return NextResponse.json(
          { error: "Chybí potvrzení platby Stripe." },
          { status: 400 },
        );
      }
      const stripe = getStripe();
      if (!stripe) {
        return NextResponse.json(
          { error: "Stripe není nastavené." },
          { status: 500 },
        );
      }
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== "succeeded") {
        return NextResponse.json(
          { error: "Platba ještě nebyla dokončena." },
          { status: 402 },
        );
      }
      if (intent.amount !== fees.total * 100) {
        return NextResponse.json(
          { error: "Částka platby nesedí." },
          { status: 400 },
        );
      }
    } else if (!mockPay) {
      return NextResponse.json(
        { error: "Platba není potvrzena." },
        { status: 400 },
      );
    }

    const order = await createOrder({
      customerName,
      customerPhone,
      customerAddress: fulfillment === "delivery" ? customerAddress : undefined,
      note,
      fulfillment,
      deliveryZoneId:
        fulfillment === "delivery" ? fees.deliveryZone?.id : undefined,
      deliveryZoneName:
        fulfillment === "delivery" ? fees.deliveryZone?.name : undefined,
      packagingFee: fees.packagingFee,
      deliveryFee: fees.deliveryFee,
      itemsTotal,
      items: normalized,
      total: fees.total,
      paymentMethod: "card",
      paid: true,
      stripePaymentIntentId: paymentIntentId || undefined,
    });

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        number: order.number,
        total: order.total,
      },
      paymentMode: hasStripe() ? "stripe" : "mock",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Objednávku se nepodařilo odeslat." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "Chybí id." }, { status: 400 });
    }

    const patch: {
      status?: "new" | "preparing" | "ready" | "done";
      printedAt?: string;
    } = {};
    if (body.status) patch.status = body.status;
    if (body.markPrinted) patch.printedAt = new Date().toISOString();

    const order = await updateOrder(id, patch);
    if (!order) {
      return NextResponse.json(
        { error: "Objednávka nenalezena." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ error: "Úprava selhala." }, { status: 500 });
  }
}
