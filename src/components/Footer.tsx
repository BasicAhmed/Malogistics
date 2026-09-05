import Link from "next/link";
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
          <p className="text-xs font-mono">We arrange it. You forget the hassle.</p>
        </div>
        <div className="text-xs font-mono flex flex-col gap-1">
          <span>5 WHITFORD ROAD, GERMISTON, LAMBTON</span>
          <span>brand@malogisticsza.com</span>
        </div>
      </div>
      <div className="flex gap-6 mt-6 text-xs font-mono flex-wrap">
        <Link href="/about" className="hover:text-paper">About</Link>
        <Link href="/routes" className="hover:text-paper">Routes</Link>
        <Link href="/track" className="hover:text-paper">Track</Link>
        <Link href="/privacy" className="hover:text-paper">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-paper">Terms &amp; Conditions</Link>
      </div>
      <ManifestCodes className="text-fog/50 mt-8" />
      </div>
    </footer>
  );
}
