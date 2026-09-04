"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Ship, Warehouse, Route, PackageSearch } from "lucide-react";
import Reveal from "./Reveal";

const services = [
  {
    icon: Truck,
    title: "Road Freight (FTL & LTL)",
    desc: "Full truckload and groupage arranged across South Africa and the SADC corridor, with route plans built around customs windows.",
  },
  {
    icon: ShieldCheck,
    title: "Cross-Border Logistics",
    desc: "Clearance and transit through Beit Bridge, Kazungula, Kopfontein and Lebombo, handled by teams who know each post.",
  },
  {
    icon: Ship,
    title: "Sea & Air Freight",
    desc: "Consolidated and full-container ocean freight via Durban and Walvis Bay, with air options for time-critical cargo.",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Distribution",
    desc: "Yard-to-door handling with tracked handovers at every stage, not just at pickup and delivery.",
  },
  {
    icon: Route,
    title: "Supply Chain Solutions",
    desc: "End-to-end planning for businesses moving regular volumes across multiple Southern African markets.",
  },
  {
    icon: PackageSearch,
    title: "Specialised Cargo",
    desc: "Abnormal and project cargo handled with appropriate permits and equipment — enquire for scope and compliance details.",
  },
];

export default function Services() {
  return (
    <section id="services" className="px-6 md:px-10 py-24 bg-paper">
      <div className="max-w-7xl mx-auto">
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
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group bg-white rounded-xl p-6 h-full relative shadow-sm hover:shadow-xl hover:shadow-cargo-maroon/5 transition-shadow border border-fog/60"
              >
                <span className="absolute top-0 left-6 h-[3px] w-0 bg-signal-amber transition-all duration-300 group-hover:w-12 rounded-full" />
                <div className="w-11 h-11 rounded-lg bg-cargo-maroon/5 flex items-center justify-center mb-4 group-hover:bg-signal-amber/15 transition-colors">
                  <s.icon size={20} className="text-cargo-maroon" strokeWidth={1.75} />
                </div>
                <h3 className="font-display font-semibold text-lg text-cargo-maroon mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-steel leading-relaxed">{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
