"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Order, OrderStatus } from "@/lib/orders";
import { KitchenTicket } from "@/components/kitchen-ticket";
import { formatPrice } from "@/lib/money";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Nová",
  preparing: "Připravuje se",
  ready: "Hotovo k výdeji",
  done: "Uzavřená",
};

export function AdminOrdersClient({ authenticated }: { authenticated: boolean }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (!res.ok) {
      setError("Nepodařilo se načíst objednávky. Jste přihlášeni?");
      return;
    }
    const data = await res.json();
    setOrders(data.orders || []);
    setError(null);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    load();
    const id = window.setInterval(load, 8000);
    return () => window.clearInterval(id);
  }, [authenticated, load]);

  async function setStatus(id: string, status: OrderStatus) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function printTicket(order: Order) {
    setPrintOrder(order);
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, markPrinted: true, status: "preparing" }),
    });
    window.setTimeout(() => {
      window.print();
      load();
    }, 80);
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p>
          Pro frontu objednávek se přihlaste v{" "}
          <Link href="/admin" className="text-[var(--brand-red)] underline">
            administraci
          </Link>
          .
        </p>
      </div>
    );
  }

  const queue = orders.filter((o) => o.status !== "done");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--brand-green)]">
            Fronta objednávek
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Zaplacené objednávky z webu. Vytiskněte lístek pro kuchyň.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load}>
            Obnovit
          </Button>
          <Button asChild className="btn-green">
            <Link href="/admin">Zpět do adminu</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 text-[var(--brand-red)] print:hidden">{error}</p>
      ) : null}

      <div className="space-y-4 print:hidden">
        {queue.length === 0 ? (
          <p className="text-[var(--muted)]">Žádné otevřené objednávky.</p>
        ) : (
          queue.map((order) => (
            <article
              key={order.id}
              className="border border-[var(--line)] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold">
                    #{order.number} · {order.customerName}
                  </h2>
                  <p className="text-[var(--muted)]">
                    {order.customerPhone} ·{" "}
                    {order.fulfillment === "delivery" ? "Rozvoz" : "Vyzvednutí"} ·{" "}
                    {STATUS_LABEL[order.status]}
                    {order.paid ? " · Zaplaceno kartou" : ""}
                  </p>
                </div>
                <p className="text-2xl font-black text-[var(--brand-red)]">
                  {formatPrice(order.total)}
                </p>
              </div>
              <ul className="mt-4 space-y-1">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.name}`}>
                    {item.qty}× {item.name}{" "}
                    <span className="text-[var(--muted)]">
                      ({formatPrice(item.unitPrice * item.qty)})
                    </span>
                  </li>
                ))}
                <li>
                  Balení{" "}
                  <span className="text-[var(--muted)]">
                    ({formatPrice(order.packagingFee ?? 0)})
                  </span>
                </li>
                <li>
                  Doprava
                  {order.deliveryZoneName ? ` · ${order.deliveryZoneName}` : ""}{" "}
                  <span className="text-[var(--muted)]">
                    ({formatPrice(order.deliveryFee ?? 0)})
                  </span>
                </li>
              </ul>
              {order.customerAddress ? (
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Adresa: {order.customerAddress}
                </p>
              ) : null}
              {order.note ? (
                <p className="mt-3 text-sm text-[var(--brand-green)]">
                  Poznámka: {order.note}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                <Button className="btn-green" onClick={() => printTicket(order)}>
                  Vytisknout lístek
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatus(order.id, "ready")}
                >
                  Hotovo k výdeji
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatus(order.id, "done")}
                >
                  Uzavřít
                </Button>
              </div>
            </article>
          ))
        )}
      </div>

      <div ref={printRef} className="hidden print:block">
        {printOrder ? <KitchenTicket order={printOrder} /> : null}
      </div>
    </div>
  );
}
