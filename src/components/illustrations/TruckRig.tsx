export default function TruckRig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 140"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {/* Container trailer */}
      <rect x="20" y="30" width="230" height="70" />
      {/* Container ribs */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={40 + i * 22} y1="30" x2={40 + i * 22} y2="100" strokeWidth="1.25" opacity="0.5" />
      ))}
      {/* Cab */}
      <path d="M250 100 V55 H285 L320 80 V100 Z" />
      {/* Windscreen */}
      <line x1="285" y1="55" x2="285" y2="72" strokeWidth="1.5" />
      {/* Chevron accent on cab door - the brand mark's "A" */}
      <path d="M295 65 L308 80 L295 95" stroke="#E8A33D" strokeWidth="4" />
      {/* Chassis line */}
      <line x1="8" y1="100" x2="335" y2="100" />
      {/* Wheels */}
      <circle cx="55" cy="108" r="14" />
      <circle cx="115" cy="108" r="14" />
      <circle cx="270" cy="108" r="14" />
      <circle cx="305" cy="108" r="14" />
      <circle cx="55" cy="108" r="4" fill="currentColor" />
      <circle cx="115" cy="108" r="4" fill="currentColor" />
      <circle cx="270" cy="108" r="4" fill="currentColor" />
      <circle cx="305" cy="108" r="4" fill="currentColor" />
    </svg>
  );
}
