"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/financial", label: "Financial" },
  { href: "/admin/quotations", label: "Quotations" },
  { href: "/admin/pricing", label: "Pricing" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => setAdminName(d.name))
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper text-cargo-maroon">
      <header className="bg-cargo-maroon text-paper px-6 md:px-10 pt-5">
        <div className="flex items-center justify-between pb-5">
          <div className="flex items-center gap-1.5 font-display font-bold text-lg">
            <span>M</span>
            <span className="text-signal-amber">/</span>
            <span>Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {adminName && <span className="text-xs font-mono text-fog">Signed in as {adminName}</span>}
            <button onClick={logout} className="text-sm text-fog hover:text-paper">
              Log out
            </button>
          </div>
        </div>
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-4 py-2.5 text-sm font-mono whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? "border-signal-amber text-paper"
                    : "border-transparent text-fog hover:text-paper"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto">{children}</div>
      <p className="text-center text-[10px] font-mono text-steel/60 pb-6">
        Built by{" "}
        <a href="https://ninotechy.com" target="_blank" rel="noopener noreferrer" className="hover:text-steel">
          Nino Techy
        </a>
      </p>
    </div>
  );
}
