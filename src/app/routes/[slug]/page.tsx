import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CORRIDORS, getCorridor } from "@/lib/corridors";

export function generateStaticParams() {
  return CORRIDORS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const corridor = getCorridor(params.slug);
  if (!corridor) return {};
  const title = `Freight from ${corridor.origin} to ${corridor.destination}`;
  const description = `Shipping from ${corridor.origin} to ${corridor.destination}: ${corridor.distanceKm}km, ${corridor.transitTime} transit. ${corridor.blurb}`;
  return {
    title,
    description,
    alternates: { canonical: `/routes/${corridor.slug}` },
    openGraph: { title, description },
  };
}

export default function CorridorPage({ params }: { params: { slug: string } }) {
  const corridor = getCorridor(params.slug);
  if (!corridor) notFound();

  return (
    <main>
      <Nav />
      <section className="px-6 md:px-10 py-20 bg-cargo-maroon text-paper">
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
            {corridor.crossBorder ? "Cross-border route" : "Domestic route"}
          </p>
          <h1 className="font-display font-bold text-3xl md:text-5xl mb-6">
            {corridor.origin} → {corridor.destination}
          </h1>
          <p className="text-fog text-lg leading-relaxed mb-8">{corridor.blurb}</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-deck-maroon rounded-lg p-5">
              <p className="text-xs font-mono text-fog mb-1">DISTANCE</p>
              <p className="font-display font-bold text-2xl">{corridor.distanceKm} km</p>
            </div>
            <div className="bg-deck-maroon rounded-lg p-5">
              <p className="text-xs font-mono text-fog mb-1">TYPICAL TRANSIT</p>
              <p className="font-display font-bold text-xl">{corridor.transitTime}</p>
            </div>
            {corridor.borderPost && (
              <div className="bg-deck-maroon rounded-lg p-5">
                <p className="text-xs font-mono text-fog mb-1">BORDER POST</p>
                <p className="font-display font-bold text-xl">{corridor.borderPost}</p>
              </div>
            )}
          </div>

          <a
            href={`/#enquiry`}
            className="inline-block bg-signal-amber text-cargo-maroon font-semibold px-6 py-3 rounded"
          >
            Get a quote for this route →
          </a>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 bg-paper">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-cargo-maroon mb-4">
            Other routes we run
          </h2>
          <ul className="space-y-2">
            {CORRIDORS.filter((c) => c.slug !== corridor.slug).map((c) => (
              <li key={c.slug}>
                <a href={`/routes/${c.slug}`} className="text-cargo-maroon underline text-sm">
                  {c.origin} → {c.destination} ({c.distanceKm}km)
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}
