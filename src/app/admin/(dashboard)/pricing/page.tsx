"use client";

import { useEffect, useState } from "react";
import { PricingConfig, DEFAULT_PRICING_CONFIG } from "@/lib/pricing";

const FIELDS: { key: keyof PricingConfig; label: string; suffix?: string; group: string }[] = [
  { key: "basePrice", label: "Base price (regional)", suffix: "R", group: "Base rates" },
  { key: "localBasePrice", label: "Base price (local / in-city)", suffix: "R", group: "Base rates" },
  { key: "pricePerKg", label: "Price per kg", suffix: "R", group: "Base rates" },
  { key: "pricePerKm", label: "Price per km", suffix: "R", group: "Base rates" },
  { key: "pricePerVolume", label: "Price per m³", suffix: "R", group: "Base rates" },

  { key: "categoryMultiplierGeneral", label: "General cargo multiplier", suffix: "×", group: "Category multipliers" },
  { key: "categoryMultiplierContainerized", label: "Containerised multiplier", suffix: "×", group: "Category multipliers" },
  { key: "categoryMultiplierColdChain", label: "Cold-chain multiplier", suffix: "×", group: "Category multipliers" },

  { key: "coldChainFee", label: "Cold-chain handling fee", suffix: "R", group: "Fixed fees" },
  { key: "containerHandlingFee", label: "Container handling fee", suffix: "R", group: "Fixed fees" },
  { key: "crossBorderFee", label: "Cross-border clearance fee", suffix: "R", group: "Fixed fees" },
  { key: "minimumCharge", label: "Minimum charge (floor)", suffix: "R", group: "Fixed fees" },

  { key: "urgencyFlexiblePct", label: "Flexible / planning ahead", suffix: "%", group: "Urgency surcharge" },
  { key: "urgencyThisMonthPct", label: "This month", suffix: "%", group: "Urgency surcharge" },
  { key: "urgencyTwoWeeksPct", label: "Within 2 weeks", suffix: "%", group: "Urgency surcharge" },
  { key: "urgencyThisWeekPct", label: "This week (urgent)", suffix: "%", group: "Urgency surcharge" },

  { key: "taxPct", label: "Tax / VAT", suffix: "%", group: "Tax" },
];

const GROUPS = Array.from(new Set(FIELDS.map((f) => f.group)));

export default function PricingConfigPage() {
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing-config")
      .then((r) => r.json())
      .then((c) => {
        setConfig(c);
        setLoading(false);
      });
  }, []);

  function update(key: keyof PricingConfig, value: string) {
    setSaved(false);
    setConfig((c) => ({ ...c, [key]: Number(value) }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/pricing-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      setConfig(await res.json());
      setSaved(true);
    }
    setSaving(false);
  }

  if (loading) return <p className="text-steel text-sm">Loading pricing configuration…</p>;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">Pricing configuration</h1>
      <p className="text-sm text-steel mb-8 max-w-2xl">
        Every quote generated from now on uses these values — nothing is hard-coded. Changing a
        number here doesn't affect quotes already sent, only new ones.
      </p>

      {GROUPS.map((group) => (
        <div key={group} className="mb-8">
          <h2 className="font-display font-semibold text-lg mb-3">{group}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FIELDS.filter((f) => f.group === group).map((f) => (
              <div key={f.key}>
                <label className="text-xs font-mono text-steel">{f.label}</label>
                <div className="flex items-center gap-2 mt-1">
                  {f.suffix === "R" && <span className="text-sm text-steel">R</span>}
                  <input
                    type="number"
                    step="0.01"
                    value={config[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="w-full bg-fog/40 rounded p-2.5 text-sm"
                  />
                  {f.suffix && f.suffix !== "R" && <span className="text-sm text-steel">{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-3 rounded text-sm disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save pricing configuration"}
      </button>
    </div>
  );
}
