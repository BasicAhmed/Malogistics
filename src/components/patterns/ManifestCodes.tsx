const codes = [
  "MAEU 471 8829",
  "TGHU 920 1142",
  "GESU 305 9001",
  "HLXU 117 4408",
  "MSCU 880 2155",
  "CMAU 622 7700",
  "ZIMU 145 6712",
  "OOLU 553 8014",
];

export default function ManifestCodes({ className = "" }: { className?: string }) {
  const row = [...codes, ...codes];
  return (
    <div className={`overflow-hidden font-mono text-[10px] tracking-wider ${className}`} aria-hidden="true">
      <div className="flex gap-8 whitespace-nowrap animate-marquee">
        {row.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
    </div>
  );
}
