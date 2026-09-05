import Reveal from "./Reveal";

const FAQS = [
  {
    q: "How quickly can I get a quote?",
    a: "Fill in the enquiry form and you'll see an instant estimate before you even submit. A dispatcher confirms the exact quote — usually within a few hours during business days.",
  },
  {
    q: "Do you own your own trucks?",
    a: "No — we're a freight forwarder, not a carrier. We match every shipment to a vetted carrier partner for the right vehicle, corridor, and rate, so you get market pricing instead of whatever's parked in a single company's yard.",
  },
  {
    q: "What areas do you cover?",
    a: "We're based in Germiston, Gauteng, and arrange freight across South Africa and into Botswana, Zimbabwe, Zambia, Mozambique, Lesotho, Eswatini, and Namibia.",
  },
  {
    q: "Can I track my shipment?",
    a: "Yes — every confirmed shipment gets a tracking number you can check any time at malogisticsza.com/track. If you lose it, you can look it up again using the email or phone number you gave us.",
  },
  {
    q: "What documents do I need for a cross-border shipment?",
    a: "It depends on the route and goods, but generally you'll need a commercial invoice, packing list, and any relevant permits. Your dispatcher will tell you exactly what's needed for your specific route before confirming.",
  },
  {
    q: "How is my quote calculated?",
    a: "Based on weight, volume, distance, goods category, and urgency — you'll see a full line-item breakdown before confirming, both on-screen and in a downloadable PDF. No hidden fees.",
  },
];

export default function FAQ() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="px-6 md:px-10 py-24 bg-fog/40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
            Questions
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-cargo-maroon mb-12">
            Common questions
          </h2>
        </Reveal>
        <div className="space-y-6">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="border-b border-fog pb-6">
                <h3 className="font-display font-semibold text-lg text-cargo-maroon mb-2">
                  {f.q}
                </h3>
                <p className="text-sm text-steel leading-relaxed">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
