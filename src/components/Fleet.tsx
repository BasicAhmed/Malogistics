"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import TruckRig from "./illustrations/TruckRig";
import Bakkie from "./illustrations/Bakkie";

const fleet = [
  {
    Icon: TruckRig,
    name: "Full Truckload (FTL)",
    note: "Dedicated rigs for containerised and bulk freight on the long-haul corridors.",
    wide: true,
  },
  {
    Icon: Bakkie,
    name: "Last-Mile & Local",
    note: "Bakkies and light vehicles for final-mile delivery and urban pickups.",
    wide: false,
  },
];

export default function Fleet() {
  return (
    <section className="px-6 md:px-10 py-24 bg-paper overflow-hidden">
      <Reveal>
        <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
          The fleet
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-cargo-maroon mb-12 max-w-xl">
          Built for the road, not the brochure.
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
        <Reveal className="md:col-span-2">
          <div className="bg-cargo-maroon rounded-lg p-8 md:p-10 h-full flex flex-col justify-between min-h-[280px] relative overflow-hidden">
            <div>
              <p className="text-xs font-mono text-signal-amber mb-2">01 · LONG-HAUL</p>
              <h3 className="font-display font-semibold text-2xl text-paper mb-2">
                Full Truckload &amp; Groupage
              </h3>
              <p className="text-fog text-sm max-w-sm">
                Dedicated rigs for containerised and bulk freight, running the
                Beit Bridge, Kazungula, Kopfontein and Lebombo corridors.
              </p>
            </div>
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="self-end w-full max-w-md text-paper mt-6"
            >
              <TruckRig className="w-full h-auto" />
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-deck-maroon rounded-lg p-8 h-full flex flex-col justify-between min-h-[280px]">
            <div>
              <p className="text-xs font-mono text-signal-amber mb-2">02 · LAST-MILE</p>
              <h3 className="font-display font-semibold text-2xl text-paper mb-2">
                Local &amp; Final-Mile
              </h3>
              <p className="text-fog text-sm">
                Bakkies and light vehicles for urban pickups and final
                delivery to your door.
              </p>
            </div>
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-paper mt-6"
            >
              <Bakkie className="w-full h-auto" />
            </motion.div>
          </div>
        </Reveal>
      </div>

      <p className="text-xs text-steel font-mono mt-6">
        Fleet illustrations shown in brand style — real fleet photography can
        replace these once supplied.
      </p>
    </section>
  );
}
