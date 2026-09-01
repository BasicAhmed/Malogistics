"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus, STATUS_LABELS, STATUS_ORDER } from "@/lib/types";

type Performance = {
  total: number;
  byStatus: Record<string, number>;
  delivered: number;
  onTimeRate: number | null;
  corridorCounts: Record<string, number>;
  quotedValue: number;
};

const emptyForm = {
  goodsType: "",
  origin: "",
  destination: "",
  details: "",
  urgency: "",
  name: "",
  company: "",
  phone: "",
  email: "",
  corridor: "",
  quoteAmount: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [perf, setPerf] = useState<Performance | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [ordersRes, perfRes] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/performance"),
    ]);
    if (ordersRes.ok) setOrders((await ordersRes.json()).orders);
    if (perfRes.ok) setPerf(await perfRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <main className="min-h-screen bg-paper text-cargo-maroon">
      <header className="bg-cargo-maroon text-paper px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-display font-bold text-lg">
          <span>M</span>
          <span className="text-signal-amber">/</span>
          <span>Admin</span>
        </div>
        <button onClick={logout} className="text-sm text-fog hover:text-paper">
          Log out
        </button>
      </header>

      <div className="px-6 md:px-10 py-10 max-w-6xl mx-auto">
        {/* Performance */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-2xl mb-4">Performance</h2>
          {perf ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total orders" value={perf.total} />
              <StatCard label="Delivered" value={perf.delivered} />
              <StatCard
                label="On-time rate"
                value={perf.onTimeRate === null ? "—" : `${perf.onTimeRate.toFixed(1)}%`}
              />
              <StatCard
                label="Quoted value"
                value={`R ${perf.quotedValue.toLocaleString()}`}
              />
            </div>
          ) : (
            <p className="text-steel text-sm">Loading…</p>
          )}

          {perf && Object.keys(perf.byStatus).length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {STATUS_ORDER.map((s) => (
                <div key={s} className="bg-fog/40 rounded px-4 py-2 text-sm">
                  <span className="font-mono text-steel">{STATUS_LABELS[s]}</span>{" "}
                  <span className="font-semibold">{perf.byStatus[s] ?? 0}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sales: log new order */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-2xl">Orders</h2>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="bg-signal-amber text-cargo-maroon font-semibold px-4 py-2 rounded text-sm"
            >
              {showForm ? "Cancel" : "+ Log new order"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleCreate}
              className="bg-fog/40 rounded-lg p-6 grid md:grid-cols-2 gap-3 mb-8"
            >
              <Input label="Customer name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Input label="Company (optional)" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
              <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required type="email" />
              <Input label="Origin" value={form.origin} onChange={(v) => setForm({ ...form, origin: v })} />
              <Input label="Destination" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} />
              <Input label="Goods type" value={form.goodsType} onChange={(v) => setForm({ ...form, goodsType: v })} />
              <Input label="Corridor (e.g. JNB-DUR)" value={form.corridor} onChange={(v) => setForm({ ...form, corridor: v })} />
              <Input label="Quote amount (ZAR)" value={form.quoteAmount} onChange={(v) => setForm({ ...form, quoteAmount: v })} type="number" />
              <Input label="Urgency" value={form.urgency} onChange={(v) => setForm({ ...form, urgency: v })} />
              <div className="md:col-span-2">
                <label className="text-xs font-mono text-steel">Details</label>
                <textarea
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  className="w-full bg-paper border border-fog rounded p-3 mt-1"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <button className="bg-cargo-maroon text-paper font-semibold px-6 py-2.5 rounded text-sm">
                  Save order
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="text-steel text-sm">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-steel text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-xs font-mono text-steel border-b border-fog">
                    <th className="py-2 pr-4">Tracking #</th>
                    <th className="py-2 pr-4">Customer</th>
                    <th className="py-2 pr-4">Route</th>
                    <th className="py-2 pr-4">Source</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-fog/60">
                      <td className="py-3 pr-4 font-mono">{o.trackingNumber}</td>
                      <td className="py-3 pr-4">
                        {o.name}
                        {o.company ? <span className="text-steel"> · {o.company}</span> : null}
                      </td>
                      <td className="py-3 pr-4 text-steel">
                        {o.origin || "—"} → {o.destination || "—"}
                      </td>
                      <td className="py-3 pr-4 text-xs font-mono text-steel">
                        {o.source === "web_enquiry" ? "Web" : "Sales"}
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                          className="bg-fog/40 rounded px-2 py-1 text-xs font-mono"
                        >
                          {STATUS_ORDER.concat("cancelled").map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s as OrderStatus]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-4 text-xs font-mono text-steel">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-cargo-maroon text-paper rounded-lg p-5">
      <div className="text-2xl font-display font-bold">{value}</div>
      <div className="text-xs font-mono text-fog mt-1">{label}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-mono text-steel">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-paper border border-fog rounded p-3 mt-1"
      />
    </div>
  );
}
