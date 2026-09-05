import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About MA Logistics",
  description:
    "MA Logistics is a freight forwarder based in Germiston, Gauteng, arranging road, cross-border, sea, and air freight across South Africa and the SADC region.",
};

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <section className="px-6 md:px-10 py-20 bg-cargo-maroon text-paper">
        <div className="max-w-2xl mx-auto">
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
            About us
          </p>
          <h1 className="font-display font-bold text-3xl md:text-5xl mb-6">
            The right carrier, matched to every shipment.
          </h1>
          <p className="text-fog text-lg leading-relaxed">
            MA Logistics is a freight forwarder based at 5 Whitford Road, Germiston, Lambton —
            right in the middle of Gauteng's industrial corridor. We arrange road, cross-border,
            sea, and air freight across South Africa and into Botswana, Zimbabwe, Zambia,
            Mozambique, Lesotho, Eswatini, and Namibia.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 bg-paper">
        <div className="max-w-2xl mx-auto space-y-8 text-steel leading-relaxed text-sm">
          <div>
            <h2 className="font-display font-semibold text-xl text-cargo-maroon mb-2">
              How we work
            </h2>
            <p>
              As a freight forwarder, we match every shipment to a vetted carrier
              partner based on the route, vehicle type, and rate — so you get the
              right option for your specific shipment, backed by a network built
              for exactly that job.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-cargo-maroon mb-2">
              Why that matters
            </h2>
            <p>
              It means pricing that reflects the actual market instead of one company's fixed
              overhead, and access to the right equipment for the job — whether that's a
              standard truckload, a temperature-controlled vehicle, or specialised handling for
              abnormal cargo.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-cargo-maroon mb-2">
              Where we operate
            </h2>
            <p>
              Based in Germiston, Gauteng, we run freight domestically across South Africa and
              on cross-border corridors into Botswana (via Kopfontein), Zimbabwe (via Beit
              Bridge), Zambia (via Chirundu), Mozambique (via Lebombo), Lesotho, Eswatini, and
              Namibia.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-cargo-maroon mb-2">
              Get in touch
            </h2>
            <p>
              5 Whitford Road, Germiston, Lambton
              <br />
              brand@malogisticsza.com
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
