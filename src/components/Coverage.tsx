"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import RouteLines from "./patterns/RouteLines";

const markets = [
  { name: "South Africa", note: "Durban · Johannesburg · Pretoria" },
  { name: "Botswana", note: "Gaborone · Kazungula corridor" },
  { name: "Zimbabwe", note: "Harare · Bulawayo · Beit Bridge" },
  { name: "Zambia", note: "Lusaka · Ndola" },
];

export default function Coverage() {
  return (
    <section id="routes" className="relative px-6 md:px-10 py-24 bg-cargo-maroon text-paper overflow-hidden">
      <RouteLines className="absolute inset-0 w-full h-full text-fog opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <Reveal>
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
            Geographic presence
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-12 max-w-xl">
            Routes across Southern Africa.
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {markets.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-deck-maroon rounded-lg p-5 h-full"
              >
                <span className="w-2 h-2 rounded-full bg-signal-amber mb-4 inline-block" />
                <h3 className="font-display font-semibold mb-1">{m.name}</h3>
                <p className="text-xs text-fog font-mono">{m.note}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <p className="text-xs text-fog font-mono mt-10">
          Additional cross-border routes into Mozambique and Namibia available on enquiry.
        </p>
      </div>
    </section>
  );
}
