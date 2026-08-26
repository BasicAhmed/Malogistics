"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TrackPage() {
  const [ref, setRef] = useState("");
  const [checked, setChecked] = useState(false);

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
            Live self-service tracking is coming soon. In the meantime, enter
            your reference and we&apos;ll confirm status directly with a
            dispatcher.
          </p>

          <div className="flex gap-3 mb-6">
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="e.g. MAEU 471 8829"
              className="flex-1 bg-deck-maroon rounded p-4 font-mono text-paper placeholder:text-fog outline-none"
            />
            <button
              onClick={() => setChecked(true)}
              className="bg-signal-amber text-cargo-maroon font-semibold px-6 rounded text-sm"
            >
              Check
            </button>
          </div>

          {checked && (
            <div className="bg-deck-maroon rounded-lg p-6">
              <p className="font-mono text-xs text-fog mb-2">REFERENCE · {ref || "—"}</p>
              <p className="text-paper">
                We couldn&apos;t find automatic status for this reference yet
                — real-time tracking isn&apos;t live. A dispatcher will follow
                up with the current status shortly.
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
