"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Services" },
    { href: "/routes", label: "Routes" },
    { href: "/track", label: "Track" },
    { href: "#about", label: "About" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cargo-maroon/95 backdrop-blur-sm shadow-lg shadow-black/10" : "bg-cargo-maroon"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        <Link href="/" className="flex items-center gap-1.5 font-display font-bold text-lg tracking-tight text-paper">
          <span>M</span>
          <span className="text-signal-amber">/</span>
          <span className="hidden sm:inline">MA Logistics</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-fog">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="relative group py-1">
              {l.label}
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-signal-amber transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#enquiry"
            className="hidden sm:inline-block bg-signal-amber text-cargo-maroon font-semibold px-4 py-2 rounded text-sm whitespace-nowrap transition-transform hover:-translate-y-0.5"
          >
            Request a quote →
          </a>
          <button
            className="md:hidden text-paper"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-cargo-maroon border-t border-deck-maroon px-6 py-4 flex flex-col gap-4 text-fog text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="#enquiry"
            onClick={() => setMobileOpen(false)}
            className="bg-signal-amber text-cargo-maroon font-semibold px-4 py-2.5 rounded text-sm text-center mt-1"
          >
            Request a quote →
          </a>
        </div>
      )}
    </nav>
  );
}
