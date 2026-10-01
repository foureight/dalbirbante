"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CheckoutMeta = {
  customerName: string;
  customerPhone: string;
  note: string;
  fulfillment: "pickup" | "delivery";
};

function StripePayForm({
  meta,
  items,
  onSuccess,
  onError,
}: {
  meta: CheckoutMeta;
  items: { name: string; unitPrice: number; qty: number }[];
  onSuccess: (number: number) => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    onError("");

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/menu`,
      },
    });

    if (result.error) {
      onError(result.error.message || "Platba selhala.");
      setBusy(false);
      return;
    }

    const paymentIntentId = result.paymentIntent?.id;
    if (!paymentIntentId) {
      onError("Platba nebyla dokončena.");
      setBusy(false);
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...meta, items, paymentIntentId }),
    });
    const data = await res.json();
    if (!res.ok) {
      onError(data.error || "Objednávku se nepodařilo uložit.");
      setBusy(false);
      return;
    }
    onSuccess(data.order.number);
    setBusy(false);
  }

  return (
    <form onSubmit={pay} className="space-y-4">
      <PaymentElement />
      <Button type="submit" className="btn-green w-full" disabled={busy || !stripe}>
        {busy ? "Platím…" : "Zaplatit kartou"}
      </Button>
    </form>
  );
}

export function CartDrawer() {
  const { items, total, count, open, setOpen, setQty, removeItem, clear } =
    useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">(
    "pickup",
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [mode, setMode] = useState<"stripe" | "mock" | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState("");

  useEffect(() => {
    if (!open) {
      setStep(items.length ? "cart" : "cart");
      setError(null);
    }
  }, [open, items.length]);

  const stripePromise = useMemo(() => {
    if (!publishableKey) return null;
    return loadStripe(publishableKey) as Promise<Stripe | null>;
  }, [publishableKey]);

  const orderItems = items.map((i) => ({
    name: i.name,
    unitPrice: i.unitPrice,
    qty: i.qty,
  }));

  const meta: CheckoutMeta = {
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    note: note.trim(),
    fulfillment,
  };

  async function startCheckout(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...meta, items: orderItems }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Checkout se nepodařil.");
      return;
    }
    setMode(data.mode);
    if (data.mode === "stripe") {
      setClientSecret(data.clientSecret);
      setPublishableKey(data.publishableKey || "");
      setStep("checkout");
    } else {
      setStep("checkout");
    }
  }

  async function mockPay() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...meta, items: orderItems, mockPay: true }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Objednávku se nepodařilo odeslat.");
      return;
    }
    setOrderNumber(data.order.number);
    clear();
    setStep("done");
  }

  function handleStripeSuccess(number: number) {
    setOrderNumber(number);
    clear();
    setClientSecret(null);
    setStep("done");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Zavřít košík"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h2 className="text-xl font-extrabold text-[var(--brand-green)]">
            Košík {count > 0 ? `(${count})` : ""}
          </h2>
          <button
            type="button"
            className="text-sm font-semibold uppercase text-[var(--muted)]"
            onClick={() => setOpen(false)}
          >
            Zavřít
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "done" ? (
            <div className="space-y-4">
              <p className="text-2xl font-extrabold text-[var(--brand-green)]">
                Objednávka #{orderNumber} je zaplacená
              </p>
              <p className="text-[var(--muted)]">
                Dorazila do fronty v restauraci. Připravíme ji co nejdřív.
              </p>
              <Button className="btn-green" onClick={() => setOpen(false)}>
                Pokračovat
              </Button>
            </div>
          ) : null}

          {step === "cart" ? (
            items.length === 0 ? (
              <p className="text-[var(--muted)]">Košík je prázdný.</p>
            ) : (
              <ul className="space-y-5">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-4"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.detail?.glutenFree || item.detail?.extras?.length ? (
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {item.detail.glutenFree ? "Bezlepková" : "Klasická"}
                          {item.detail.extras?.length
                            ? ` · ${item.detail.extras.join(", ")}`
                            : ""}
                        </p>
                      ) : null}
                      <p className="text-[var(--muted)]">
                        {formatPrice(item.unitPrice)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="size-8 border border-[var(--line)]"
                          onClick={() => setQty(item.key, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center">{item.qty}</span>
                        <button
                          type="button"
                          className="size-8 border border-[var(--line)]"
                          onClick={() => setQty(item.key, item.qty + 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-2 text-sm text-[var(--brand-red)]"
                          onClick={() => removeItem(item.key)}
                        >
                          Odebrat
                        </button>
                      </div>
                    </div>
                    <p className="font-bold text-[var(--brand-red)]">
                      {formatPrice(item.unitPrice * item.qty)}
                    </p>
                  </li>
                ))}
              </ul>
            )
          ) : null}

          {step === "checkout" ? (
            <div className="space-y-5">
              <p className="text-sm text-[var(--muted)]">
                Platba kartou přes Stripe
                {mode === "mock"
                  ? " (teď běží testovací režim bez klíčů)."
                  : "."}
              </p>
              {mode === "stripe" && clientSecret && stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: { theme: "stripe" },
                    locale: "cs",
                  }}
                >
                  <StripePayForm
                    meta={meta}
                    items={orderItems}
                    onSuccess={handleStripeSuccess}
                    onError={(msg) => setError(msg || null)}
                  />
                </Elements>
              ) : null}
              {mode === "mock" ? (
                <div className="space-y-3 rounded-[6.4px] border border-[var(--line)] bg-[var(--paper-soft)] p-4">
                  <p className="text-sm text-[var(--muted)]">
                    Doplňte <code>STRIPE_SECRET_KEY</code> a{" "}
                    <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> pro ostré
                    platby. Teď můžete odeslat testovací objednávku.
                  </p>
                  <Button
                    type="button"
                    className="btn-green w-full"
                    disabled={busy}
                    onClick={mockPay}
                  >
                    {busy ? "Odesílám…" : `Zaplatit testově ${formatPrice(total)}`}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === "cart" && items.length > 0 ? (
            <form onSubmit={startCheckout} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <Label>Jméno</Label>
                <Input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Telefon</Label>
                <Input
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="rounded-none"
                  placeholder="733 572 911"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Vyzvednutí / rozvoz</Label>
                <select
                  className="h-10 w-full border border-[var(--line)] bg-white px-3"
                  value={fulfillment}
                  onChange={(e) =>
                    setFulfillment(
                      e.target.value === "delivery" ? "delivery" : "pickup",
                    )
                  }
                >
                  <option value="pickup">Vyzvednutí na místě</option>
                  <option value="delivery">Rozvoz</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Poznámka</Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="rounded-none"
                  rows={3}
                />
              </div>
              <Button type="submit" className="btn-green w-full" disabled={busy}>
                {busy ? "Připravuji platbu…" : `K platbě · ${formatPrice(total)}`}
              </Button>
            </form>
          ) : null}

          {error ? (
            <p className="mt-4 text-sm text-[var(--brand-red)]">{error}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
