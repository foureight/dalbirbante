import { promises as fs } from "fs";
import path from "path";

export type OrderItem = {
  name: string;
  unitPrice: number;
  qty: number;
  categoryId?: string;
};

export type OrderStatus = "new" | "preparing" | "ready" | "done";

export type Order = {
  id: string;
  number: number;
  createdAt: string;
  status: OrderStatus;
  paid: boolean;
  paymentMethod: "card" | "on_site";
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  note: string;
  fulfillment: "pickup" | "delivery";
  deliveryZoneId?: string;
  deliveryZoneName?: string;
  packagingFee: number;
  deliveryFee: number;
  itemsTotal: number;
  items: OrderItem[];
  total: number;
  stripePaymentIntentId?: string;
  printedAt?: string;
};

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

type OrdersFile = {
  nextNumber: number;
  orders: Order[];
};

async function readFile(): Promise<OrdersFile> {
  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf8");
    return JSON.parse(raw) as OrdersFile;
  } catch {
    return { nextNumber: 1, orders: [] };
  }
}

async function writeFile(data: OrdersFile) {
  await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  await fs.writeFile(ORDERS_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function listOrders(): Promise<Order[]> {
  const data = await readFile();
  return [...data.orders].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  const data = await readFile();
  return data.orders.find((o) => o.id === id) ?? null;
}

export async function createOrder(
  input: Omit<Order, "id" | "number" | "createdAt" | "status" | "paid"> & {
    paid?: boolean;
  },
): Promise<Order> {
  const data = await readFile();
  const order: Order = {
    ...input,
    id: `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    number: data.nextNumber,
    createdAt: new Date().toISOString(),
    status: "new",
    paid: input.paid ?? true,
  };
  data.nextNumber += 1;
  data.orders.unshift(order);
  await writeFile(data);
  return order;
}

export async function updateOrder(
  id: string,
  patch: Partial<Pick<Order, "status" | "printedAt">>,
): Promise<Order | null> {
  const data = await readFile();
  const idx = data.orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  data.orders[idx] = { ...data.orders[idx], ...patch };
  await writeFile(data);
  return data.orders[idx];
}
