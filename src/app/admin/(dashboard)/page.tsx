"use client";

import { useEffect, useState } from "react";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

type Performance = {
  total: number;
  byStatus: Record<string, number>;
  delivered: number;
  onTimeRate: number | null;
  corridorCounts: Record<string, number>;
  quotedValue: number;
};

export default function OverviewPage() {
  const [perf, setPerf] = useState<Performance | null>(null);

  useEffect(() => {
    fetch("/api/admin/performance")
      .then((r) => r.json())
      .then(setPerf);
  }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-8">Overview</h1>

      {!perf ? (
        <p className="text-steel text-sm">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total orders" value={perf.total} />
            <StatCard label="Delivered" value={perf.delivered} />
            <StatCard
              label="On-time rate"
              value={perf.onTimeRate === null ? "—" : `${perf.onTimeRate.toFixed(1)}%`}
            />
            <StatCard label="Quoted value" value={formatCurrency(perf.quotedValue)} />
          </div>

          <h2 className="font-display font-semibold text-lg mb-4">Pipeline</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {STATUS_ORDER.map((s) => (
              <div key={s} className="bg-fog/40 rounded-lg px-5 py-4 flex items-center justify-between">
                <span className="text-sm font-mono text-steel">{STATUS_LABELS[s]}</span>
                <span className="text-xl font-display font-bold">{perf.byStatus[s] ?? 0}</span>
              </div>
            ))}
          </div>

          {Object.keys(perf.corridorCounts).length > 0 && (
            <>
              <h2 className="font-display font-semibold text-lg mb-4">Volume by corridor</h2>
              <div className="space-y-2">
                {Object.entries(perf.corridorCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([corridor, count]) => (
                    <div key={corridor} className="flex items-center gap-3">
                      <span className="text-sm font-mono w-40 truncate">{corridor}</span>
                      <div className="flex-1 bg-fog/40 rounded h-2">
                        <div
                          className="bg-signal-amber h-2 rounded"
                          style={{ width: `${Math.min(100, (count / perf.total) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-steel w-6 text-right">{count}</span>
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
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
