"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cargo-maroon border-t border-deck-maroon px-4 py-3 flex items-center gap-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <a
            href="/track"
            className="flex-1 text-center border border-fog text-paper text-sm font-semibold px-4 py-2.5 rounded"
          >
            Track
          </a>
          <a
            href="#enquiry"
            className="flex-[2] text-center bg-signal-amber text-cargo-maroon text-sm font-semibold px-4 py-2.5 rounded"
          >
            Get a quote →
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
