"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type TrackResult = {
  found: boolean;
  trackingNumber?: string;
  statusLabel?: string;
  origin?: string;
  destination?: string;
  goodsType?: string;
  history?: { label: string; at: string }[];
};

export default function TrackPage() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkStatus() {
    if (!ref.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(ref.trim())}`);
      if (res.status === 404) {
        setResult({ found: false });
      } else {
        setResult(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Nav />
      <section className="px-6 md:px-10 py-20 bg-cargo-maroon text-paper min-h-[60vh]">
        <div className="max-w-xl mx-auto">
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
            Shipment tracking
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Enter your reference number.
          </h1>
          <p className="text-fog mb-8 text-sm">
            Use the tracking number from your enquiry or confirmation email.
          </p>

          <div className="flex gap-3 mb-6">
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkStatus()}
              placeholder="e.g. MA-7X9K2QF"
              className="flex-1 bg-deck-maroon rounded p-4 font-mono text-paper placeholder:text-fog outline-none"
            />
            <button
              onClick={checkStatus}
              disabled={loading}
              className="bg-signal-amber text-cargo-maroon font-semibold px-6 rounded text-sm disabled:opacity-50"
            >
              {loading ? "…" : "Check"}
            </button>
          </div>

          {result && result.found && (
            <div className="bg-deck-maroon rounded-lg p-6">
              <p className="font-mono text-xs text-fog mb-2">
                REFERENCE · {result.trackingNumber}
              </p>
              <p className="font-display font-semibold text-xl mb-1">{result.statusLabel}</p>
              <p className="text-fog text-sm mb-4">
                {result.origin} → {result.destination}
                {result.goodsType ? ` · ${result.goodsType}` : ""}
              </p>
              {result.history && result.history.length > 0 && (
                <ul className="text-xs font-mono text-fog space-y-1 border-t border-cargo-maroon pt-3">
                  {result.history.map((h, i) => (
                    <li key={i}>
                      {new Date(h.at).toLocaleString()} — {h.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {result && !result.found && (
            <div className="bg-deck-maroon rounded-lg p-6">
              <p className="text-paper">
                We couldn&apos;t find that reference. Double-check the number,
                or contact the team directly if you believe this is an error.
              </p>
              <a
                href="/#enquiry"
                className="inline-block mt-4 text-signal-amber text-sm underline"
              >
                Contact the team directly →
              </a>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
