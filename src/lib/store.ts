import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Order, OrderStatus, StatusEvent } from "./types";
import { generateTrackingNumber } from "./tracking";

// NOTE: This is a JSON-file store — good for local development and demos.
// On serverless hosts (e.g. Vercel) the filesystem is ephemeral/read-only,
// so writes will not persist between requests in production. Before going
// live, swap the four functions below for calls to a real database
// (Postgres via Prisma/Supabase is the natural next step) — the rest of
// the app only depends on this module's exported functions, not on how
// they're implemented.

const DATA_FILE = path.join(process.cwd(), "data", "orders.json");

function readAll(): Order[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export function listOrders(): Order[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrderByTrackingNumber(trackingNumber: string): Order | undefined {
  const normalized = trackingNumber.trim().toUpperCase();
  return readAll().find((o) => o.trackingNumber === normalized);
}

export function getOrderById(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}

export function createOrder(
  input: Omit<
    Order,
    "id" | "trackingNumber" | "status" | "createdAt" | "updatedAt" | "history"
  > & { status?: OrderStatus }
): Order {
  const orders = readAll();
  const now = new Date().toISOString();

  let trackingNumber = generateTrackingNumber();
  while (orders.some((o) => o.trackingNumber === trackingNumber)) {
    trackingNumber = generateTrackingNumber();
  }

  const status: OrderStatus = input.status ?? "enquiry";
  const order: Order = {
    ...input,
    id: randomUUID(),
    trackingNumber,
    status,
    createdAt: now,
    updatedAt: now,
    history: [{ status, at: now }],
  };

  orders.push(order);
  writeAll(orders);
  return order;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: Partial<Pick<Order, "quoteAmount" | "corridor" | "onTime">>
): Order | undefined {
  const orders = readAll();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;

  const now = new Date().toISOString();
  const event: StatusEvent = { status, at: now };
  orders[idx] = {
    ...orders[idx],
    ...extra,
    status,
    updatedAt: now,
    history: [...orders[idx].history, event],
  };
  writeAll(orders);
  return orders[idx];
}

export function performanceStats() {
  const orders = readAll();
  const total = orders.length;
  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const delivered = orders.filter((o) => o.status === "delivered");
  const onTimeCount = delivered.filter((o) => o.onTime).length;
  const onTimeRate = delivered.length ? (onTimeCount / delivered.length) * 100 : null;

  const corridorCounts = orders.reduce((acc, o) => {
    const key = o.corridor || `${o.origin} → ${o.destination}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const quotedValue = orders.reduce((sum, o) => sum + (o.quoteAmount ?? 0), 0);

  return {
    total,
    byStatus,
    delivered: delivered.length,
    onTimeRate,
    corridorCounts,
    quotedValue,
  };
}
