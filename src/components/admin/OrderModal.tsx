"use client";

import { Order, OrderStatus, STATUS_LABELS, STATUS_ORDER } from "@/lib/types";
import { formatDateTime, formatCurrency } from "@/lib/format";
import StatusBadge from "./StatusBadge";
import { useState } from "react";

export default function OrderModal({
  order,
  onClose,
  onUpdated,
}: {
  order: Order;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [quoteAmount, setQuoteAmount] = useState(order.quoteAmount?.toString() ?? "");
  const [corridor, setCorridor] = useState(order.corridor ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        quoteAmount: quoteAmount ? Number(quoteAmount) : undefined,
        corridor: corridor || undefined,
      }),
    });
    setSaving(false);
    onUpdated();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-paper text-cargo-maroon w-full md:max-w-2xl md:rounded-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-cargo-maroon text-paper px-6 py-5 flex items-center justify-between sticky top-0">
          <div>
            <p className="font-mono text-xs text-fog">{order.trackingNumber}</p>
            <p className="font-display font-semibold text-lg">{order.name}</p>
          </div>
          <button onClick={onClose} className="text-fog hover:text-paper text-xl leading-none">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-xs font-mono text-steel">
              {order.source === "web_enquiry" ? "Web enquiry" : "Sales — logged manually"}
            </span>
          </div>

          <Section title="Submitted">
            <Row label="Created" value={formatDateTime(order.createdAt)} />
            <Row label="Last updated" value={formatDateTime(order.updatedAt)} />
          </Section>

          <Section title="Customer">
            <Row label="Name" value={order.name} />
            {order.company && <Row label="Company" value={order.company} />}
            <Row label="Phone" value={order.phone} />
            <Row label="Email" value={order.email} />
          </Section>

          <Section title="Shipment">
            <Row label="Goods type" value={order.goodsType || "—"} />
            <Row label="Origin" value={order.origin || "—"} />
            <Row label="Destination" value={order.destination || "—"} />
            <Row label="Urgency" value={order.urgency || "—"} />
            {order.details && <Row label="Details" value={order.details} />}
          </Section>

          <Section title="History">
            <ul className="text-sm font-mono text-steel space-y-1">
              {order.history.map((h, i) => (
                <li key={i}>
                  {formatDateTime(h.at)} — {STATUS_LABELS[h.status]}
                  {h.by ? ` (${h.by})` : ""}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Sales & ops (editable)">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-steel">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                >
                  {STATUS_ORDER.concat("cancelled" as OrderStatus).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-steel">Corridor</label>
                <input
                  value={corridor}
                  onChange={(e) => setCorridor(e.target.value)}
                  placeholder="e.g. JNB-DUR"
                  className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-steel">Quote amount (ZAR)</label>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                />
                {order.quoteAmount != null && (
                  <p className="text-xs text-steel mt-1">
                    Current: {formatCurrency(order.quoteAmount)}
                  </p>
                )}
              </div>
            </div>
          </Section>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="text-sm text-steel px-4 py-2.5">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-2.5 rounded text-sm disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-mono uppercase tracking-widest text-signal-amber mb-2">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-steel">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
