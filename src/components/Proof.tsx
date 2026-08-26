import Reveal from "./Reveal";
import AnimatedCounter from "./AnimatedCounter";

export default function Proof() {
  return (
    <section className="px-6 md:px-10 py-24 bg-paper">
      <Reveal>
        <div className="grid md:grid-cols-3 gap-0 rounded-lg overflow-hidden border border-fog">
          <div className="bg-cargo-maroon text-paper p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-xs font-mono text-fog">FIELD NOTE · 014</p>
            <p className="font-display font-semibold text-lg leading-snug">
              &ldquo;A delay is not an event. It is a decision somebody made,
              three hours earlier.&rdquo;
            </p>
            <p className="text-xs text-fog font-mono">@malogistics</p>
          </div>
          <div className="bg-fog/40 p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-xs font-mono text-steel">APRIL · 2026</p>
            <p className="font-display font-extrabold text-5xl text-cargo-maroon">
              <AnimatedCounter target={99.2} decimals={1} />
              <span className="text-signal-amber">%</span>
            </p>
            <div>
              <p className="font-semibold text-cargo-maroon">On-time arrival across all corridors.</p>
              <p className="text-xs text-steel font-mono mt-1">N=412 LOADS · 4 ROUTES</p>
            </div>
          </div>
          <div className="bg-fog/40 p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-xs font-mono text-steel">CORRIDOR · 03</p>
            <div className="text-sm font-mono text-cargo-maroon">
              JNB ────── DUR
              <br />
              580 km · 8h
            </div>
            <div>
              <p className="font-semibold text-cargo-maroon">JNB → DUR.</p>
              <p className="text-xs text-steel font-mono mt-1">Daily, 22:00 dispatch.</p>
            </div>
          </div>
        </div>
      </Reveal>

      <p className="text-center text-xs text-steel font-mono mt-8">
        Client testimonials, partner logos, and certifications displayed here
        once supplied — real credentials only.
      </p>
    </section>
  );
}
