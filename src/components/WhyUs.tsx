import Reveal from "./Reveal";

const points = [
  {
    title: "Named accountability",
    body: "When we say we, we mean it. If a load runs late, you get a reason and a new time — not a status update.",
  },
  {
    title: "Regional route knowledge",
    body: "Beit Bridge, Kazungula, Kopfontein, Lebombo — our dispatchers know each border post's rhythm, not just its name.",
  },
  {
    title: "Tracked handovers",
    body: "Every load is tracked from yard to dock. Every handoff is logged, not assumed.",
  },
  {
    title: "Transparent transit times",
    body: "We publish realistic corridor times up front, so a quote comes with an honest arrival window.",
  },
];

export default function WhyUs() {
  return (
    <section id="about" className="px-6 md:px-10 py-24 bg-fog/40">
      <Reveal>
        <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
          Why MA Logistics
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-cargo-maroon mb-12 max-w-xl">
          Specific, not abstract.
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
        {points.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <h3 className="font-display font-semibold text-lg text-cargo-maroon mb-2">
              {p.title}
            </h3>
            <p className="text-sm text-steel max-w-md">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
