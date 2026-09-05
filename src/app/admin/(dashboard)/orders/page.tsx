"use client";

import { useEffect, useState, useCallback } from "react";
import { Order, OrderStatus, STATUS_LABELS, STATUS_ORDER } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderModal from "@/components/admin/OrderModal";
import { Trash2 } from "lucide-react";

const PAGE_SIZE = 25;

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) {
      const json = await res.json();
      setOrders(json.orders);
      setTotal(json.total);
    }
    setLoading(false);
  }, [page, q, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    setShowForm(false);
    setPage(1);
    load();
  }

  async function quickStatus(id: string, s: OrderStatus) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    load();
  }

  async function deleteOne(id: string, trackingNumber: string) {
    if (!confirm(`Delete order ${trackingNumber}? This can't be undone.`)) return;
    await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    load();
  }

  async function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} order(s)? This can't be undone.`)) return;
    setDeleting(true);
    await Promise.all(
      Array.from(selectedIds).map((id) => fetch(`/api/admin/orders/${id}`, { method: "DELETE" }))
    );
    setSelectedIds(new Set());
    setDeleting(false);
    load();
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.id)));
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl md:text-3xl">Orders</h1>
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

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Search name, email, phone, tracking #…"
          className="flex-1 min-w-[200px] bg-fog/40 rounded p-2.5 text-sm outline-none"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="bg-fog/40 rounded p-2.5 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_ORDER.concat("cancelled" as OrderStatus).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs font-mono text-steel mb-3 flex items-center gap-4">
        <span>{total} order{total === 1 ? "" : "s"}</span>
        {selectedIds.size > 0 && (
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="flex items-center gap-1.5 text-status-hold font-semibold disabled:opacity-50"
          >
            <Trash2 size={14} />
            {deleting ? "Deleting…" : `Delete selected (${selectedIds.size})`}
          </button>
        )}
      </p>

      {loading ? (
        <p className="text-steel text-sm">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-steel text-sm">No orders match.</p>
      ) : (
        <div className="overflow-x-auto border border-fog rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs font-mono text-steel bg-fog/40">
                <th className="py-2.5 px-4">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedIds.size === orders.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-2.5 px-4">Tracking #</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Route</th>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Submitted</th>
                <th className="py-2.5 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-fog hover:bg-fog/20 cursor-pointer"
                  onClick={() => setSelected(o)}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(o.id)}
                      onChange={() => toggleSelect(o.id)}
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">{o.trackingNumber}</td>
                  <td className="py-3 px-4">
                    {o.name}
                    {o.company ? <span className="text-steel"> · {o.company}</span> : null}
                  </td>
                  <td className="py-3 px-4 text-steel">
                    {o.origin || "—"} → {o.destination || "—"}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-steel">
                    {o.source === "web_enquiry" ? "Web" : "Sales"}
                  </td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={o.status}
                      onChange={(e) => quickStatus(o.id, e.target.value as OrderStatus)}
                      className="bg-transparent"
                    >
                      {STATUS_ORDER.concat("cancelled" as OrderStatus).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-steel whitespace-nowrap">
                    {formatDateTime(o.createdAt)}
                  </td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => deleteOne(o.id, o.trackingNumber)}
                      className="text-steel hover:text-status-hold"
                      title="Delete order"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="text-xs font-mono text-steel">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}

      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={load}
        />
      )}
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
