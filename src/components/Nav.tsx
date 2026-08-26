import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-5 bg-cargo-maroon text-paper sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-1.5 font-display font-bold text-lg tracking-tight">
        <span>M</span>
        <span className="text-signal-amber">/</span>
        <span className="hidden sm:inline">MA Logistics</span>
      </Link>
      <div className="hidden md:flex gap-8 text-sm text-fog">
        <a href="#services" className="hover:text-paper">Services</a>
        <a href="#routes" className="hover:text-paper">Routes</a>
        <Link href="/track" className="hover:text-paper">Track</Link>
        <a href="#about" className="hover:text-paper">About</a>
        <a href="#enquiry" className="hover:text-paper">Contact</a>
      </div>
      <a
        href="#enquiry"
        className="bg-signal-amber text-cargo-maroon font-semibold px-4 py-2 rounded text-sm whitespace-nowrap"
      >
        Request a quote →
      </a>
    </nav>
  );
}
