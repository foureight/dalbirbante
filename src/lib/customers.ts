import { promises as fs } from "fs";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { dataFile, ensureRuntimeFile } from "./data-dir";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  passwordHash: string;
  createdAt: string;
};

type Store = {
  customers: Customer[];
};

async function customersPath(): Promise<string> {
  return ensureRuntimeFile(
    "customers.json",
    JSON.stringify({ customers: [] }, null, 2) + "\n",
  );
}

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(await customersPath(), "utf8");
    const data = JSON.parse(raw) as Store;
    return { customers: Array.isArray(data.customers) ? data.customers : [] };
  } catch {
    return { customers: [] };
  }
}

async function writeStore(store: Store) {
  const file = dataFile("customers.json");
  await fs.mkdir(dataFile(), { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

export async function findCustomerByEmail(email: string) {
  const store = await readStore();
  const normalized = email.trim().toLowerCase();
  return store.customers.find((c) => c.email === normalized) ?? null;
}

export async function findCustomerById(id: string) {
  const store = await readStore();
  return store.customers.find((c) => c.id === id) ?? null;
}

export async function createCustomer(input: {
  name: string;
  email: string;
  phone: string;
  address?: string;
  password: string;
}) {
  const store = await readStore();
  const email = input.email.trim().toLowerCase();
  if (store.customers.some((c) => c.email === email)) {
    throw new Error("EMAIL_EXISTS");
  }

  const customer: Customer = {
    id: `cus_${Date.now().toString(36)}_${randomBytes(3).toString("hex")}`,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    address: (input.address || "").trim(),
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  store.customers.unshift(customer);
  await writeStore(store);
  return customer;
}

export function publicCustomer(customer: Customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
  };
}
