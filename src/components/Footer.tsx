export default function Footer() {
  return (
    <footer className="bg-cargo-maroon text-fog px-6 md:px-10 py-10">
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
          <span>WINDHOEK · GABORONE · JOHANNESBURG · MAPUTO</span>
          <span>brand@malogistics.co</span>
        </div>
      </div>
      <p className="text-[10px] font-mono text-fog/60 mt-8">
        MAEU 471 8829 · TGHU 920 1142 · GESU 305 9001 · HLXU 117 4408
      </p>
    </footer>
  );
}
