"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const stages = [
  {
    label: "Origin",
    mono: "01 · PICKUP",
    body: "Your goods leave the supplier or warehouse floor. We log weight, count, and condition before the doors close.",
  },
  {
    label: "Collection",
    mono: "02 · YARD",
    body: "Consolidated into the right vehicle for the route — FTL, LTL groupage, or specialised equipment for abnormal loads.",
  },
  {
    label: "Processing",
    mono: "03 · CLEARANCE",
    body: "Documentation and customs paperwork prepared ahead of the border, so the truck doesn't wait on us.",
  },
  {
    label: "Cross-Border",
    mono: "04 · TRANSIT",
    body: "Beit Bridge, Kazungula, Kopfontein, Lebombo — routed through the post our dispatchers know best for your cargo.",
  },
  {
    label: "Delivery",
    mono: "05 · HANDOVER",
    body: "Final-mile delivery to your door or distribution point, with a named driver and a signed handover.",
  },
  {
    label: "Confirmation",
    mono: "06 · CLOSED",
    body: "Proof of delivery logged and sent. The shipment is closed — not just delivered, accounted for.",
  },
];

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.4"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="journey"
      ref={ref}
      className="relative px-6 md:px-10 py-24 bg-cargo-maroon text-paper overflow-hidden"
    >
      <div className="max-w-3xl mb-16">
        <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
          How a shipment moves
        </p>
        <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight">
          We move containers the way clocks move time.
        </h2>
        <p className="text-fog mt-5 max-w-xl">
          Six quiet stages, tracked the same way every time. Scroll to follow
          a shipment from origin to confirmed delivery.
        </p>
      </div>

      <div className="relative grid md:grid-cols-[2px_1fr] gap-x-10">
        {/* Track line — hidden on mobile, shown on md+ */}
        <div className="hidden md:block relative w-[2px] bg-deck-maroon rounded-full">
          <motion.div
            style={{ height: lineHeight }}
            className="absolute top-0 left-0 w-[2px] bg-signal-amber rounded-full"
          />
        </div>

        <div className="flex flex-col gap-14 md:gap-20">
          {stages.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="relative md:pl-4"
            >
              {/* dot aligned to the track, desktop only */}
              <span className="hidden md:block absolute -left-[46px] top-1.5 w-3 h-3 rounded-full bg-signal-amber ring-4 ring-cargo-maroon" />
              <p className="text-xs font-mono text-signal-amber mb-2">{s.mono}</p>
              <h3 className="font-display font-semibold text-2xl mb-2">{s.label}</h3>
              <p className="text-fog max-w-md text-sm leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
