"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import TruckRig from "./illustrations/TruckRig";
import Bakkie from "./illustrations/Bakkie";

export default function Fleet() {
  return (
    <section className="px-6 md:px-10 py-24 bg-paper overflow-hidden">
      <div className="max-w-7xl mx-auto">
      <Reveal>
        <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
          How it moves
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-cargo-maroon mb-4 max-w-xl">
          We don't own the trucks. We own the outcome.
        </h2>
        <p className="text-steel max-w-xl mb-12">
          As a freight forwarder, we match every shipment to a vetted carrier
          partner for the right vehicle, corridor, and rate — so you get the
          best option on the market, not whatever's sitting in a yard.
        </p>
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
                Carrier partners running the Beit Bridge, Kazungula, Kopfontein
                and Lebombo corridors — booked against live rates, not a fixed
                price list.
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
                Local courier and light-vehicle partners for urban pickups and
                door-to-door delivery within a city.
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
        Illustrations shown in brand style, representing vehicle types arranged through our carrier network.
      </p>
      </div>
    </section>
  );
}
