export default function ContainerRibs({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="ribs" width="28" height="100%" patternUnits="userSpaceOnUse">
          <rect width="20" height="100%" fill="currentColor" opacity="0.06" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ribs)" />
    </svg>
  );
}
