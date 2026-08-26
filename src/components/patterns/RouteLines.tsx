export default function RouteLines({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M0 40 C 150 10, 250 90, 400 60 S 650 20, 800 50"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <path
        d="M0 110 C 150 150, 300 70, 450 120 S 700 160, 800 130"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <path
        d="M0 170 C 200 200, 350 140, 500 175 S 700 200, 800 180"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />
      <circle cx="220" cy="55" r="4" fill="#E8A33D" />
      <circle cx="470" cy="95" r="4" fill="#E8A33D" />
      <circle cx="640" cy="145" r="4" fill="#E8A33D" />
    </svg>
  );
}
