"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Order } from "@/lib/types";
import {
  calculateQuote,
  validateQuoteInput,
  CATEGORY_LABELS,
  URGENCY_LABELS,
  GoodsCategory,
  QuoteUrgency,
  DeliveryScope,
  PricingConfig,
  DEFAULT_PRICING_CONFIG,
} from "@/lib/pricing";
import { lookupDistance } from "@/lib/distances";
import { formatCurrency, formatDateTime } from "@/lib/format";
import LocationInput from "@/components/LocationInput";

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [category, setCategory] = useState<GoodsCategory>("general");
  const [weightKg, setWeightKg] = useState("500");
  const [volumeM3, setVolumeM3] = useState("2");
  const [scope, setScope] = useState<DeliveryScope>("regional");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [urgency, setUrgency] = useState<QuoteUrgency>("flexible");
  const [crossBorder, setCrossBorder] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendResult, setSendResult] = useState<{ pdfAttached: boolean; pdfError?: string; emailSent?: boolean } | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const [pending, setPending] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/admin/pricing-config")
      .then((r) => r.json())
      .then(setConfig);
  }, []);

  const loadPending = useCallback(async () => {
    const res = await fetch("/api/admin/orders?status=quoted&pageSize=50");
    if (res.ok) setPending((await res.json()).orders);
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  useEffect(() => {
    if (!search) {
      setCandidates([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/orders?q=${encodeURIComponent(search)}&pageSize=8`);
      if (res.ok) setCandidates((await res.json()).orders);
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  function pickOrder(o: Order) {
    setSelected(o);
    setOrigin(o.origin || "");
    setDestination(o.destination || "");
    if (o.goodsType?.toLowerCase().includes("cold") || o.goodsType?.toLowerCase().includes("temperature")) {
      setCategory("cold_chain");
    } else if (o.goodsType?.toLowerCase().includes("container")) {
      setCategory("containerized");
    } else {
      setCategory("general");
    }
    if (o.urgency === "This week") setUrgency("this_week");
    else if (o.urgency === "Within 2 weeks") setUrgency("two_weeks");
    else if (o.urgency === "This month") setUrgency("this_month");
    else setUrgency("flexible");
    setSearch("");
    setCandidates([]);
    setSent(false);
    setServerErrors([]);
  }

  const looked = useMemo(() => lookupDistance(origin, destination), [origin, destination]);
  const effectiveDistance = distanceKm ? Number(distanceKm) : looked ?? 0;

  const inputs = useMemo(
    () => ({
      category,
      weightKg: Number(weightKg) || 0,
      volumeM3: Number(volumeM3) || 0,
      distanceKm: effectiveDistance,
      scope,
      urgency,
      crossBorder,
    }),
    [category, weightKg, volumeM3, effectiveDistance, scope, urgency, crossBorder]
  );

  const clientErrors = useMemo(() => validateQuoteInput(inputs), [inputs]);
  const sameCity =
    scope === "regional" && origin.trim() && destination.trim() && origin.trim().toLowerCase() === destination.trim().toLowerCase();

  const breakdown = useMemo(() => calculateQuote(inputs, config), [inputs, config]);

  async function sendQuote() {
    if (!selected || clientErrors.length > 0 || sameCity) return;
    setSending(true);
    setServerErrors([]);
    const res = await fetch("/api/admin/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: selected.id, origin, destination, ...inputs }),
    });
    setSending(false);
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      setServerErrors(json?.errors?.map((e: any) => e.message) ?? [json?.error ?? "Failed to send quote."]);
      return;
    }
    const json = await res.json();
    setSendResult({
      pdfAttached: json.pdfAttached,
      pdfError: json.pdfError,
      emailSent: json.emailResult?.sent,
    });
    setSent(true);
    loadPending();
  }

  const canSend = !!selected && clientErrors.length === 0 && !sameCity && !!origin && !!destination;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">Quotations</h1>
      <p className="text-sm text-steel mb-8">
        Pick an order, set the shipment details, and send a branded quote with PDF attached.
        Follow-ups go out automatically if there's no reply.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-4 relative">
            <label className="text-xs font-mono text-steel">Find order</label>
            <input
              value={selected ? `${selected.trackingNumber} — ${selected.name}` : search}
              onChange={(e) => {
                setSelected(null);
                setSearch(e.target.value);
              }}
              placeholder="Search tracking #, name, email…"
              className="w-full bg-fog/40 rounded p-3 mt-1 text-sm"
            />
            {candidates.length > 0 && (
              <div className="absolute z-10 bg-paper border border-fog rounded-lg mt-1 w-full shadow-lg">
                {candidates.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => pickOrder(o)}
                    className="block w-full text-left px-4 py-2.5 text-sm hover:bg-fog/40 border-b border-fog last:border-0"
                  >
                    <span className="font-mono">{o.trackingNumber}</span> — {o.name}
                    <span className="text-steel"> · {o.origin || "?"} → {o.destination || "?"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!selected ? (
            <p className="text-steel text-sm bg-fog/40 rounded-lg p-6">
              Search and select an order above to start a quote.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-steel">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoodsCategory)}
                    className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-steel">Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as DeliveryScope)}
                    className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                  >
                    <option value="regional">Regional / cross-province</option>
                    <option value="local">Local / in-city</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-steel">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-steel">Volume (m³)</label>
                  <input
                    type="number"
                    value={volumeM3}
                    onChange={(e) => setVolumeM3(e.target.value)}
                    className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-steel">Origin</label>
                  <LocationInput value={origin} onChange={setOrigin} />
                </div>
                <div>
                  <label className="text-xs font-mono text-steel">Destination</label>
                  <LocationInput value={destination} onChange={setDestination} />
                </div>
                {scope === "regional" && (
                  <div className="col-span-2">
                    <label className="text-xs font-mono text-steel">
                      Distance (km) {looked && !distanceKm ? `— auto: ${looked}km` : ""}
                    </label>
                    <input
                      type="number"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(e.target.value)}
                      placeholder={looked ? String(looked) : "Enter manually — no known route match"}
                      className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-mono text-steel">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as QuoteUrgency)}
                    className="w-full bg-fog/40 rounded p-2.5 mt-1 text-sm"
                  >
                    {Object.entries(URGENCY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={crossBorder}
                      onChange={(e) => setCrossBorder(e.target.checked)}
                    />
                    Cross-border shipment
                  </label>
                </div>
              </div>

              {(clientErrors.length > 0 || sameCity || serverErrors.length > 0) && (
                <div className="bg-status-hold/10 border border-status-hold rounded-lg p-3 space-y-1">
                  {clientErrors.map((e, i) => (
                    <p key={`c${i}`} className="text-xs text-status-hold">{e.message}</p>
                  ))}
                  {sameCity && (
                    <p className="text-xs text-status-hold">
                      Origin and destination are the same — use &quot;Local / in-city&quot; scope instead.
                    </p>
                  )}
                  {serverErrors.map((e, i) => (
                    <p key={`s${i}`} className="text-xs text-status-hold">{e}</p>
                  ))}
                </div>
              )}

              <button
                onClick={sendQuote}
                disabled={sending || !canSend}
                className="w-full bg-signal-amber text-cargo-maroon font-semibold px-6 py-3 rounded text-sm disabled:opacity-40"
              >
                {sending ? "Sending…" : sent ? "Sent ✓ — send again?" : "Send quotation email + PDF"}
              </button>

              {sendResult && (
                <div
                  className={`rounded-lg p-3 text-xs ${
                    sendResult.pdfAttached && sendResult.emailSent
                      ? "bg-status-clear/10 text-status-clear"
                      : "bg-status-hold/10 text-status-hold"
                  }`}
                >
                  <p>Email {sendResult.emailSent ? "sent ✓" : "NOT sent — check RESEND_API_KEY in Vercel"}</p>
                  <p>
                    PDF {sendResult.pdfAttached ? "attached ✓" : `NOT attached — ${sendResult.pdfError || "unknown error"}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="bg-cargo-maroon text-paper rounded-lg p-6 sticky top-4">
            <p className="text-xs font-mono text-signal-amber mb-4">LIVE BREAKDOWN</p>
            <BreakdownRow label="Base price" value={breakdown.basePrice} />
            <BreakdownRow label="Weight charge" value={breakdown.weightCost} />
            {breakdown.distanceCost > 0 && <BreakdownRow label="Distance charge" value={breakdown.distanceCost} />}
            <BreakdownRow label="Volume charge" value={breakdown.volumeCost} />
            {breakdown.coldChainFee > 0 && <BreakdownRow label="Cold-chain handling" value={breakdown.coldChainFee} />}
            {breakdown.containerHandlingFee > 0 && (
              <BreakdownRow label="Container handling" value={breakdown.containerHandlingFee} />
            )}
            {breakdown.crossBorderFee > 0 && (
              <BreakdownRow label="Cross-border clearance" value={breakdown.crossBorderFee} />
            )}
            {breakdown.urgencySurcharge > 0 && (
              <BreakdownRow label={`Urgency (${breakdown.urgencyPct}%)`} value={breakdown.urgencySurcharge} />
            )}
            <div className="border-t border-deck-maroon my-3" />
            <BreakdownRow
              label={breakdown.taxPct > 0 ? `VAT (${breakdown.taxPct}%)` : "VAT (zero-rated)"}
              value={breakdown.tax}
              muted
            />
            <div className="border-t-2 border-signal-amber my-3" />
            <BreakdownRow label="Total" value={breakdown.total} bold />

            <p className="text-xs font-mono text-fog mt-5">
              {breakdown.minimumApplied ? "Minimum charge applied · " : ""}
              Category multiplier: {breakdown.categoryMultiplier}×
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display font-semibold text-lg mb-4">Quoted — awaiting confirmation</h2>
        {pending.length === 0 ? (
          <p className="text-steel text-sm">Nothing pending.</p>
        ) : (
          <div className="overflow-x-auto border border-fog rounded-lg">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-xs font-mono text-steel bg-fog/40">
                  <th className="py-2.5 px-4">Tracking #</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Quote</th>
                  <th className="py-2.5 px-4">Sent</th>
                  <th className="py-2.5 px-4">Follow-up</th>
                  <th className="py-2.5 px-4">Next follow-up</th>
                  <th className="py-2.5 px-4">PDF</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((o) => (
                  <tr key={o.id} className="border-t border-fog">
                    <td className="py-3 px-4 font-mono">{o.trackingNumber}</td>
                    <td className="py-3 px-4">{o.name}</td>
                    <td className="py-3 px-4 font-mono">
                      {o.quoteAmount != null ? formatCurrency(o.quoteAmount) : "—"}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-steel whitespace-nowrap">
                      {o.quoteSentAt ? formatDateTime(o.quoteSentAt) : "—"}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-steel">
                      {(o.followUpStage ?? 0) === 0 ? "None yet" : `Stage ${o.followUpStage}`}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-steel whitespace-nowrap">
                      {o.nextFollowUpAt ? formatDateTime(o.nextFollowUpAt) : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`/api/admin/quotes/${o.id}/pdf`}
                        className="text-signal-amber underline text-xs"
                        target="_blank"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: number;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className={`flex justify-between text-sm py-1 ${bold ? "font-bold text-lg" : ""} ${muted ? "text-fog" : ""}`}>
      <span>{label}</span>
      <span className="font-mono">{formatCurrency(value)}</span>
    </div>
  );
}
