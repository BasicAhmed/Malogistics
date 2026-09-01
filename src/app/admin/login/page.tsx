"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <main className="min-h-screen bg-cargo-maroon text-paper flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex items-center gap-1.5 font-display font-bold text-lg mb-8">
          <span>M</span>
          <span className="text-signal-amber">/</span>
          <span>MA Logistics — Admin</span>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none mb-4"
          autoFocus
        />
        {error && <p className="text-status-hold text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-signal-amber text-cargo-maroon font-semibold px-6 py-3 rounded"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
