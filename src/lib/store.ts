import { pool } from "./db";
import { Order, OrderStatus, StatusEvent } from "./types";
import { generateTrackingNumber } from "./tracking";

// Postgres-backed store (Supabase). Table defined in supabase/schema.sql.

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    status: row.status,
    source: row.source,
    goodsType: row.goods_type,
    origin: row.origin,
    destination: row.destination,
    details: row.details,
    urgency: row.urgency,
    name: row.name,
    company: row.company ?? undefined,
    phone: row.phone,
    email: row.email,
    quoteAmount: row.quote_amount !== null ? Number(row.quote_amount) : undefined,
    corridor: row.corridor ?? undefined,
    onTime: row.on_time ?? undefined,
    createdAt: row.created_at.toISOString?.() ?? row.created_at,
    updatedAt: row.updated_at.toISOString?.() ?? row.updated_at,
    history: row.history as StatusEvent[],
  };
}

export async function listOrders(opts?: {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ orders: Order[]; total: number }> {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 25;
  const offset = (page - 1) * pageSize;

  const conditions: string[] = [];
  const values: any[] = [];

  if (opts?.status) {
    values.push(opts.status);
    conditions.push(`status = $${values.length}`);
  }
  if (opts?.q) {
    values.push(`%${opts.q.toLowerCase()}%`);
    const idx = values.length;
    conditions.push(
      `(lower(name) like $${idx} or lower(email) like $${idx} or lower(phone) like $${idx} or lower(tracking_number) like $${idx} or lower(company) like $${idx})`
    );
  }

  const where = conditions.length ? `where ${conditions.join(" and ")}` : "";

  const countRes = await pool.query(`select count(*) from orders ${where}`, values);
  const total = Number(countRes.rows[0].count);

  values.push(pageSize, offset);
  const { rows } = await pool.query(
    `select * from orders ${where} order by created_at desc limit $${values.length - 1} offset $${values.length}`,
    values
  );

  return { orders: rows.map(rowToOrder), total };
}

export async function getOrderByTrackingNumber(trackingNumber: string): Promise<Order | undefined> {
  const { rows } = await pool.query("select * from orders where tracking_number = $1", [
    trackingNumber.trim().toUpperCase(),
  ]);
  return rows[0] ? rowToOrder(rows[0]) : undefined;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const { rows } = await pool.query("select * from orders where id = $1", [id]);
  return rows[0] ? rowToOrder(rows[0]) : undefined;
}

export async function createOrder(
  input: Omit<
    Order,
    "id" | "trackingNumber" | "status" | "createdAt" | "updatedAt" | "history"
  > & { status?: OrderStatus }
): Promise<Order> {
  const status: OrderStatus = input.status ?? "enquiry";
  const now = new Date().toISOString();
  const history: StatusEvent[] = [{ status, at: now }];

  let trackingNumber = generateTrackingNumber();
  // Practically unique already, but guard against the rare collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await getOrderByTrackingNumber(trackingNumber);
    if (!existing) break;
    trackingNumber = generateTrackingNumber();
  }

  const { rows } = await pool.query(
    `insert into orders
      (tracking_number, status, source, goods_type, origin, destination, details, urgency,
       name, company, phone, email, quote_amount, corridor, history)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     returning *`,
    [
      trackingNumber,
      status,
      input.source,
      input.goodsType,
      input.origin,
      input.destination,
      input.details,
      input.urgency,
      input.name,
      input.company ?? null,
      input.phone,
      input.email,
      input.quoteAmount ?? null,
      input.corridor ?? null,
      JSON.stringify(history),
    ]
  );

  return rowToOrder(rows[0]);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: Partial<Pick<Order, "quoteAmount" | "corridor" | "onTime">>
): Promise<Order | undefined> {
  const existing = await getOrderById(id);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const event: StatusEvent = { status, at: now };
  const history = [...existing.history, event];

  const { rows } = await pool.query(
    `update orders set
      status = $1,
      quote_amount = coalesce($2, quote_amount),
      corridor = coalesce($3, corridor),
      on_time = coalesce($4, on_time),
      history = $5,
      updated_at = now()
     where id = $6
     returning *`,
    [
      status,
      extra?.quoteAmount ?? null,
      extra?.corridor ?? null,
      extra?.onTime ?? null,
      JSON.stringify(history),
      id,
    ]
  );

  return rows[0] ? rowToOrder(rows[0]) : undefined;
}

export async function performanceStats() {
  const { rows } = await pool.query("select * from orders");
  const orders = rows.map(rowToOrder);
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

  return { total, byStatus, delivered: delivered.length, onTimeRate, corridorCounts, quotedValue };
}

export async function financialStats() {
  const { rows } = await pool.query("select * from orders");
  const orders = rows.map(rowToOrder);

  const withQuote = orders.filter((o) => o.quoteAmount != null && o.quoteAmount > 0);
  const totalQuoted = withQuote.reduce((sum, o) => sum + (o.quoteAmount ?? 0), 0);

  const confirmedStatuses = new Set(["confirmed", "in_transit", "delivered"]);
  const confirmedOrders = withQuote.filter((o) => confirmedStatuses.has(o.status));
  const confirmedRevenue = confirmedOrders.reduce((sum, o) => sum + (o.quoteAmount ?? 0), 0);

  const pipelineOrders = withQuote.filter((o) => !confirmedStatuses.has(o.status) && o.status !== "cancelled");
  const pipelineValue = pipelineOrders.reduce((sum, o) => sum + (o.quoteAmount ?? 0), 0);

  const averageQuote = withQuote.length ? totalQuoted / withQuote.length : 0;

  const byCorridor = withQuote.reduce((acc, o) => {
    const key = o.corridor || `${o.origin} → ${o.destination}` || "Unspecified";
    acc[key] = (acc[key] ?? 0) + (o.quoteAmount ?? 0);
    return acc;
  }, {} as Record<string, number>);

  const recentQuotes = withQuote
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 15);

  return {
    totalQuoted,
    confirmedRevenue,
    pipelineValue,
    averageQuote,
    quotedCount: withQuote.length,
    byCorridor,
    recentQuotes,
  };
}
