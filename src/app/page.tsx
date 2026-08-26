export default function Home() {
  return (
    <main>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 bg-cargo-maroon text-paper">
        <div className="flex items-center gap-2 font-display font-bold text-lg">
          <span>M</span>
          <span className="text-signal-amber">/</span>
          <span>MA Logistics</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm">
          <a href="#services">Services</a>
          <a href="#routes">Routes</a>
          <a href="#track">Track</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <button className="bg-signal-amber text-cargo-maroon font-semibold px-4 py-2 rounded text-sm">
          Request a quote →
        </button>
      </nav>

      {/* Hero */}
      <section className="bg-cargo-maroon text-paper px-8 py-20">
        <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-4">
          Container transport · Southern Africa
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[0.95] tracking-tightest mb-6">
          Move cargo
          <br />
          without
          <br />
          the hassle<span className="text-signal-amber">.</span>
        </h1>
        <p className="max-w-md text-fog mb-8">
          118 trucks. Four corridors. Real-time handover tracking from yard to
          dock — and a dispatcher you can call by name.
        </p>
        <div className="flex gap-4">
          <button className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-3 rounded">
            Get a quote →
          </button>
          <button className="border border-fog px-6 py-3 rounded">
            Track a container
          </button>
        </div>
      </section>

      {/* Live stats footer */}
      <section className="bg-deck-maroon text-paper px-8 py-6 flex flex-wrap gap-8 text-sm font-mono">
        <div>WDH ↔ JNB · 1,720 KM · 26H</div>
        <div>GBE ↔ MPM · 1,140 KM · 18H</div>
        <div>JNB ↔ DUR · 580 KM · 8H</div>
        <div>WDH ↔ CPT · 1,490 KM · 22H</div>
      </section>
    </main>
  );
}
