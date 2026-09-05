import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main>
      <Nav />
      <section className="px-6 md:px-10 py-16 bg-paper">
        <div className="max-w-2xl mx-auto text-cargo-maroon">
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
            Legal
          </p>
          <h1 className="font-display font-bold text-3xl mb-2">Privacy Policy</h1>
          <p className="text-xs text-steel font-mono mb-10">Last updated: September 2026</p>

          <div className="space-y-6 text-sm text-steel leading-relaxed">
            <p>
              MA Logistics ("we", "us") collects and processes personal information in
              accordance with South Africa's Protection of Personal Information Act (POPIA).
              This policy explains what we collect, why, and what rights you have.
            </p>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">What we collect</h2>
              <p>
                When you request a quote or track a shipment, we collect your name, company
                (if provided), email address, phone number, and shipment details (origin,
                destination, weight, dimensions, and goods type).
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Why we collect it</h2>
              <p>
                We use this information to calculate quotes, arrange transport with carrier
                partners, send you shipment status updates, and respond to enquiries. We do not
                sell or rent your information to third parties.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Who we share it with</h2>
              <p>
                Shipment details are shared with the carrier partner assigned to your
                shipment, solely to arrange transport. Where cross-border clearance is
                required, relevant details may be shared with customs agents or authorities
                as legally required.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">How long we keep it</h2>
              <p>
                We retain shipment and enquiry records for as long as needed to fulfil the
                shipment, meet accounting and legal requirements, and resolve any disputes.
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-cargo-maroon mb-2">Your rights</h2>
              <p>
                Under POPIA, you can ask us what personal information we hold about you,
                request corrections, or request deletion where we're not legally required to
                keep it. Contact us using the details below to exercise these rights.
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
