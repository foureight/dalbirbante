import type { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/money";

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    timeZone: "Europe/Prague",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function KitchenTicket({ order }: { order: Order }) {
  return (
    <div className="kitchen-ticket">
      <div className="kitchen-ticket__brand">DAL BIRBANTE</div>
      <div className="kitchen-ticket__sub">Praha 9 – Vinoř</div>
      <div className="kitchen-ticket__rule" />
      <div className="kitchen-ticket__row kitchen-ticket__strong">
        <span>OBJEDNÁVKA</span>
        <span>#{order.number}</span>
      </div>
      <div className="kitchen-ticket__row">
        <span>{formatWhen(order.createdAt)}</span>
        <span>{order.fulfillment === "delivery" ? "ROZVOZ" : "VYZVEDNUTÍ"}</span>
      </div>
      <div className="kitchen-ticket__rule" />
      <ul className="kitchen-ticket__items">
        {order.items.map((item) => (
          <li key={`${item.name}-${item.unitPrice}`} className="kitchen-ticket__item">
            <div className="kitchen-ticket__row">
              <span>
                {item.qty}× {item.name}
              </span>
              <span>{formatPrice(item.unitPrice * item.qty)}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="kitchen-ticket__rule" />
      <div className="kitchen-ticket__row">
        <span>Balení</span>
        <span>{formatPrice(order.packagingFee ?? 0)}</span>
      </div>
      <div className="kitchen-ticket__row">
        <span>
          Doprava
          {order.deliveryZoneName ? ` (${order.deliveryZoneName})` : ""}
        </span>
        <span>{formatPrice(order.deliveryFee ?? 0)}</span>
      </div>
      <div className="kitchen-ticket__row kitchen-ticket__strong">
        <span>CELKEM</span>
        <span>{formatPrice(order.total)}</span>
      </div>
      <div className="kitchen-ticket__row">
        <span>PLATBA</span>
        <span>{order.paid ? "KARTA · ZAPLACENO" : "NEZAPLACENO"}</span>
      </div>
      <div className="kitchen-ticket__rule" />
      <div>
        <div className="kitchen-ticket__strong">{order.customerName}</div>
        <div>{order.customerPhone}</div>
        {order.customerAddress ? <div>{order.customerAddress}</div> : null}
        {order.note ? <div className="kitchen-ticket__note">Pozn.: {order.note}</div> : null}
      </div>
      <div className="kitchen-ticket__footer">Děkujeme · Buon appetito!</div>
    </div>
  );
}
