"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import RouteLines from "./patterns/RouteLines";

const corridors = [
  { route: "JHB ↔ DUR", distance: "580 KM", time: "8H" },
  { route: "JHB ↔ CPT", distance: "1,400 KM", time: "22H" },
  { route: "JHB ↔ GBE", distance: "360 KM", time: "6H" },
  { route: "JHB ↔ HRE", distance: "1,130 KM", time: "18H" },
];

export default function Hero() {
  return (
    <section className="relative bg-cargo-maroon text-paper overflow-hidden">
      <RouteLines className="absolute inset-0 w-full h-full text-fog opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-14 lg:pt-24 lg:pb-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-4">
            Freight Forwarding · Southern Africa
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tightest mb-6">
            We arrange it.
            <br />
            You forget
            <br />
            the hassle<span className="text-signal-amber">.</span>
          </h1>
          <p className="max-w-md text-fog mb-8">
            We don't own trucks — we own the outcome. Every shipment gets matched
            to the right carrier, the best rate on the corridor, and a
            dispatcher who actually answers.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="#enquiry"
              className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-3 rounded transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            >
              Get a quote →
            </a>
            <a
              href="/track"
              className="border border-fog px-6 py-3 rounded hover:bg-deck-maroon transition-colors"
            >
              Track a shipment
            </a>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {["Competitive, transparent rates", "Fast quote turnaround", "A dispatcher, not a call centre"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-fog">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-amber" />
                  {item}
                </div>
              )
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="bg-deck-maroon rounded-lg p-6 md:p-8 relative"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-fog mb-6">
            <span className="w-2 h-2 rounded-full bg-signal-amber inline-block" />
            OUR COMMITMENT
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold">
                <AnimatedCounter target={4} />
              </div>
              <div className="text-xs text-fog font-mono mt-1">ACTIVE CORRIDORS</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold">
                &lt;<AnimatedCounter target={4} />
                <span className="text-signal-amber">H</span>
              </div>
              <div className="text-xs text-fog font-mono mt-1">QUOTE TURNAROUND TARGET</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold">1:1</div>
              <div className="text-xs text-fog font-mono mt-1">A DISPATCHER YOU CAN CALL</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold">0</div>
              <div className="text-xs text-fog font-mono mt-1">HIDDEN FEES ON A QUOTE</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative border-t border-deck-maroon">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-wrap gap-x-10 gap-y-2 text-xs font-mono text-fog">
          {corridors.map((c) => (
            <div key={c.route}>
              {c.route} · {c.distance} · {c.time}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="relative flex flex-col items-center gap-1 pb-6 text-fog"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">See how it works</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}
