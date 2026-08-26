const markets = [
  { name: "South Africa", note: "Durban · Johannesburg · Pretoria" },
  { name: "Botswana", note: "Gaborone · Kazungula corridor" },
  { name: "Zimbabwe", note: "Harare · Bulawayo · Beit Bridge" },
  { name: "Zambia", note: "Lusaka · Ndola" },
];

export default function Coverage() {
  return (
    <section id="routes" className="px-6 md:px-10 py-20 bg-cargo-maroon text-paper">
      <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3">
        Geographic presence
      </p>
      <h2 className="font-display font-bold text-3xl md:text-4xl mb-12 max-w-xl">
        Routes across Southern Africa.
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {markets.map((m) => (
          <div key={m.name} className="bg-deck-maroon rounded-lg p-5">
            <div className="w-2 h-2 rounded-full bg-signal-amber mb-4" />
            <h3 className="font-display font-semibold mb-1">{m.name}</h3>
            <p className="text-xs text-fog font-mono">{m.note}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-fog font-mono mt-10">
        Additional cross-border routes into Mozambique and Namibia available on enquiry.
      </p>
    </section>
  );
}
