import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <main>
      <Nav />
      <section className="px-6 md:px-10 py-16 bg-paper">
        <div className="max-w-2xl mx-auto text-cargo-maroon">
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
            Legal
          </p>
          <h1 className="font-display font-bold text-3xl mb-2">Terms &amp; Conditions</h1>
          <p className="text-xs text-steel font-mono mb-10">Last updated: September 2026</p>

          <div className="space-y-6 text-sm text-steel leading-relaxed">
            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Our role</h2>
              <p>
                MA Logistics acts as a freight forwarder: we arrange transport of your goods
                through third-party carrier partners. We do not own the vehicles used to
                transport your cargo.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Quotes</h2>
              <p>
                Instant estimates shown on our website are indicative only, based on the
                weight, volume, and route details you provide. A confirmed quote from a
                dispatcher supersedes any online estimate and is valid for 7 days from the
                date issued, unless stated otherwise.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Accuracy of information</h2>
              <p>
                You're responsible for providing accurate weight, dimensions, and goods
                descriptions. If actual shipment details differ materially from what was
                declared, we reserve the right to adjust the final price accordingly.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Cross-border shipments</h2>
              <p>
                You're responsible for ensuring goods are legally permitted for export/import
                between the relevant countries. We assist with customs documentation but are
                not liable for delays caused by incomplete or inaccurate paperwork supplied by
                you.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Liability</h2>
              <p>
                Our liability for loss or damage in transit is limited in accordance with the
                terms of the carrier partner handling your shipment, details of which are
                available on request before you confirm a booking.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Cancellations</h2>
              <p>
                Shipments may be cancelled at no charge prior to pickup. Cancellations after
                pickup may incur a partial charge reflecting work already completed.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Contact</h2>
              <p>
                MA Logistics, 5 Whitford Road, Germiston, Lambton.
                <br />
                Email: brand@malogisticsza.com
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
