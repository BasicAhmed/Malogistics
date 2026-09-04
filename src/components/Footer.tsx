import ManifestCodes from "./patterns/ManifestCodes";

export default function Footer() {
  return (
    <footer className="bg-cargo-maroon text-fog px-6 md:px-10 py-10">
      <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-1.5 font-display font-bold text-paper mb-2">
            <span>M</span>
            <span className="text-signal-amber">/</span>
            <span>MA Logistics</span>
          </div>
          <p className="text-xs font-mono">Delivered without hassle.</p>
        </div>
        <div className="text-xs font-mono flex flex-col gap-1">
          <span>5 WHITFORD ROAD, GERMISTON, LAMBTON</span>
          <span>brand@malogistics.co</span>
        </div>
      </div>
      <ManifestCodes className="text-fog/50 mt-8" />
      </div>
    </footer>
  );
}
