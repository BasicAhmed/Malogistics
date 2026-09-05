import { UserCheck, MapPinned, Wallet, Zap } from "lucide-react";
import Reveal from "./Reveal";

const points = [
  {
    icon: UserCheck,
    title: "Named accountability",
    body: "When we say we, we mean it. If a load runs late, you get a reason and a new time — not a status update.",
  },
  {
    icon: MapPinned,
    title: "Regional route knowledge",
    body: "Beit Bridge, Kazungula, Kopfontein, Lebombo — our dispatchers know each border post's rhythm, not just its name.",
  },
  {
    icon: Wallet,
    title: "Competitive, transparent pricing",
    body: "We shop your shipment across multiple carrier partners for every quote, so you get market rate — not markup.",
  },
  {
    icon: Zap,
    title: "Fast quotes, faster support",
    body: "Most quotes go out within hours, not days. And when you need someone, you get a dispatcher on the phone — not a queue.",
  },
];

export default function WhyUs() {
  return (
    <section id="about" className="px-6 md:px-10 py-24 bg-fog/40">
      <div className="max-w-7xl mx-auto">
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
              <div className="flex gap-4">
                <div className="w-11 h-11 shrink-0 rounded-lg bg-cargo-maroon flex items-center justify-center">
                  <p.icon size={20} className="text-signal-amber" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-cargo-maroon mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-steel max-w-md leading-relaxed">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
