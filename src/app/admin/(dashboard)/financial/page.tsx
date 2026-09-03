"use client";

import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";

type Financial = {
  totalQuoted: number;
  confirmedRevenue: number;
  pipelineValue: number;
  averageQuote: number;
  quotedCount: number;
  byCorridor: Record<string, number>;
  recentQuotes: Order[];
};

export default function FinancialPage() {
  const [data, setData] = useState<Financial | null>(null);

  useEffect(() => {
    fetch("/api/admin/financial")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-8">Financial</h1>

      {!data ? (
        <p className="text-steel text-sm">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Confirmed revenue" value={formatCurrency(data.confirmedRevenue)} highlight />
            <StatCard label="Pipeline value" value={formatCurrency(data.pipelineValue)} />
            <StatCard label="Total quoted" value={formatCurrency(data.totalQuoted)} />
            <StatCard label="Average quote" value={formatCurrency(data.averageQuote)} />
          </div>

          {Object.keys(data.byCorridor).length > 0 && (
            <>
              <h2 className="font-display font-semibold text-lg mb-4">Value by corridor</h2>
              <div className="space-y-2 mb-10">
                {Object.entries(data.byCorridor)
                  .sort((a, b) => b[1] - a[1])
                  .map(([corridor, value]) => {
                    const max = Math.max(...Object.values(data.byCorridor));
                    return (
                      <div key={corridor} className="flex items-center gap-3">
                        <span className="text-sm font-mono w-40 truncate">{corridor}</span>
                        <div className="flex-1 bg-fog/40 rounded h-2">
                          <div
                            className="bg-signal-amber h-2 rounded"
                            style={{ width: `${(value / max) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-steel w-28 text-right">
                          {formatCurrency(value)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </>
          )}

          <h2 className="font-display font-semibold text-lg mb-4">Recent quotes</h2>
          {data.recentQuotes.length === 0 ? (
            <p className="text-steel text-sm">No quoted orders yet.</p>
          ) : (
            <div className="overflow-x-auto border border-fog rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-xs font-mono text-steel bg-fog/40">
                    <th className="py-2.5 px-4">Tracking #</th>
                    <th className="py-2.5 px-4">Customer</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentQuotes.map((o) => (
                    <tr key={o.id} className="border-t border-fog">
                      <td className="py-3 px-4 font-mono">{o.trackingNumber}</td>
                      <td className="py-3 px-4">{o.name}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {o.quoteAmount != null ? formatCurrency(o.quoteAmount) : "—"}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-steel whitespace-nowrap">
                        {formatDateTime(o.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-5 ${
        highlight ? "bg-signal-amber text-cargo-maroon" : "bg-cargo-maroon text-paper"
      }`}
    >
      <div className="text-2xl font-display font-bold">{value}</div>
      <div className={`text-xs font-mono mt-1 ${highlight ? "text-cargo-maroon/70" : "text-fog"}`}>
        {label}
      </div>
    </div>
  );
}
