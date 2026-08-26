"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

const services = [
  {
    title: "Road Freight (FTL & LTL)",
    desc: "Full truckload and groupage across South Africa and the SADC corridor, with route plans built around customs windows.",
  },
  {
    title: "Cross-Border Logistics",
    desc: "Clearance and transit through Beit Bridge, Kazungula, Kopfontein and Lebombo, handled by teams who know each post.",
  },
  {
    title: "Sea & Air Freight",
    desc: "Consolidated and full-container ocean freight via Durban and Walvis Bay, with air options for time-critical cargo.",
  },
  {
    title: "Warehousing & Distribution",
    desc: "Yard-to-door handling with tracked handovers at every stage, not just at pickup and delivery.",
  },
  {
    title: "Supply Chain Solutions",
    desc: "End-to-end planning for businesses moving regular volumes across multiple Southern African markets.",
  },
  {
    title: "Specialised Cargo",
    desc: "Abnormal and project cargo handled with appropriate permits and equipment — enquire for scope and compliance details.",
  },
];

export default function Services() {
  return (
    <section id="services" className="px-6 md:px-10 py-24 bg-paper">
      <Reveal>
        <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
          What we move
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-cargo-maroon mb-12 max-w-xl">
          Container transport, end to end.
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group border-t-2 border-cargo-maroon pt-4 pb-2 h-full relative"
            >
              <span className="absolute top-[-2px] left-0 h-[2px] w-0 bg-signal-amber transition-all duration-300 group-hover:w-full" />
              <h3 className="font-display font-semibold text-lg text-cargo-maroon mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-steel">{s.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
