export default function Bakkie({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 110"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {/* Load bed */}
      <path d="M100 45 H190 V85 H100 Z" />
      {/* Cab */}
      <path d="M30 85 V50 H70 L100 45 V85 Z" />
      {/* Windscreen */}
      <line x1="70" y1="50" x2="70" y2="66" strokeWidth="1.5" />
      {/* Chevron accent */}
      <path d="M45 58 L58 66 L45 74" stroke="#E8A33D" strokeWidth="3.5" />
      {/* Chassis */}
      <line x1="15" y1="85" x2="205" y2="85" />
      {/* Wheels */}
      <circle cx="55" cy="92" r="11" />
      <circle cx="165" cy="92" r="11" />
      <circle cx="55" cy="92" r="3" fill="currentColor" />
      <circle cx="165" cy="92" r="3" fill="currentColor" />
    </svg>
  );
}
