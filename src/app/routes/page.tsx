import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CORRIDORS } from "@/lib/corridors";

export const metadata: Metadata = {
  title: "Freight Routes — South Africa & SADC",
  description:
    "Freight forwarding routes across South Africa and the SADC corridor — distances, transit times, and border posts.",
};

export default function RoutesIndexPage() {
  return (
    <main>
      <Nav />
      <section className="px-6 md:px-10 py-16 bg-cargo-maroon text-paper">
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
            Routes we run
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Freight routes across South Africa &amp; the SADC corridor
          </h1>
          <p className="text-fog">
            Real distances, typical transit times, and border posts for the corridors we move
            freight on most. Don't see your route? We still quote it — these are just our most
            common lanes.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 bg-paper">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
          {CORRIDORS.map((c) => (
            <Link
              key={c.slug}
              href={`/routes/${c.slug}`}
              className="block border border-fog rounded-lg p-5 hover:border-signal-amber transition-colors"
            >
              <p className="text-xs font-mono text-signal-amber mb-1">
                {c.crossBorder ? "CROSS-BORDER" : "DOMESTIC"}
              </p>
              <h2 className="font-display font-semibold text-lg text-cargo-maroon mb-1">
                {c.origin} → {c.destination}
              </h2>
              <p className="text-xs text-steel font-mono">
                {c.distanceKm}km · {c.transitTime}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
