"use client";

// Renders a simple isometric box whose proportions reflect the entered
// L/W/H, purely as a visual aid — not a precise render. Dimensions in cm.
export default function PackageVisual({
  lengthCm,
  widthCm,
  heightCm,
}: {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}) {
  const maxDim = Math.max(lengthCm, widthCm, heightCm, 1);
  const scale = 100 / maxDim; // fit largest dimension to 100px baseline

  const w = Math.max(widthCm * scale, 20);
  const d = Math.max(lengthCm * scale, 20);
  const h = Math.max(heightCm * scale, 20);

  return (
    <div className="flex flex-col items-center py-6">
      <div
        style={{
          width: 200,
          height: 180,
          perspective: 600,
        }}
        className="flex items-center justify-center"
      >
        <div
          style={{
            width: w,
            height: h,
            transformStyle: "preserve-3d",
            transform: "rotateX(-28deg) rotateY(35deg)",
            position: "relative",
          }}
        >
          {/* Front face */}
          <div
            style={{
              position: "absolute",
              width: w,
              height: h,
              background: "#E8A33D",
              opacity: 0.9,
              transform: `translateZ(${d / 2}px)`,
              border: "1px solid #3C0008",
            }}
          />
          {/* Back face */}
          <div
            style={{
              position: "absolute",
              width: w,
              height: h,
              background: "#5A0010",
              transform: `translateZ(-${d / 2}px) rotateY(180deg)`,
              border: "1px solid #3C0008",
            }}
          />
          {/* Right face */}
          <div
            style={{
              position: "absolute",
              width: d,
              height: h,
              background: "#3C0008",
              opacity: 0.85,
              left: w / 2 - d / 2,
              transform: `rotateY(90deg) translateZ(${w / 2}px)`,
              border: "1px solid #3C0008",
            }}
          />
          {/* Top face */}
          <div
            style={{
              position: "absolute",
              width: w,
              height: d,
              background: "#F4F1EC",
              top: h / 2 - d / 2,
              transform: `rotateX(90deg) translateZ(${h / 2}px)`,
              border: "1px solid #3C0008",
            }}
          />
        </div>
      </div>
      <p className="text-xs font-mono text-steel mt-2">
        {lengthCm || 0}cm × {widthCm || 0}cm × {heightCm || 0}cm — visual approximation only
      </p>
    </div>
  );
}
