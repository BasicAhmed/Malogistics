"use client";

import { useState, useEffect, useMemo } from "react";
import LocationInput from "./LocationInput";
import PackageVisual from "./PackageVisual";
import { calculateQuote, DEFAULT_PRICING_CONFIG, PricingConfig, GoodsCategory, QuoteUrgency, DeliveryScope } from "@/lib/pricing";
import { lookupDistance } from "@/lib/distances";
import { isCrossBorder } from "@/lib/locations";
import { formatCurrency } from "@/lib/format";

type FormData = {
  goodsType: string;
  origin: string;
  destination: string;
  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  packageConfirmed: boolean;
  timeline: string;
  name: string;
  company: string;
  phone: string;
  email: string;
};

const initialData: FormData = {
  goodsType: "",
  origin: "",
  destination: "",
  weightKg: "",
  lengthCm: "",
  widthCm: "",
  heightCm: "",
  packageConfirmed: false,
  timeline: "",
  name: "",
  company: "",
  phone: "",
  email: "",
};

const PRESETS: Record<string, { l: string; w: string; h: string }> = {
  "Small box": { l: "30", w: "30", h: "30" },
  "Medium box": { l: "50", w: "50", h: "50" },
  "Large box": { l: "80", w: "60", h: "60" },
};

const LIMITS = { maxWeightKg: 40000, maxDimCm: 1200 };

const steps = [
  "What are you shipping?",
  "Where is it coming from?",
  "Where is it going?",
  "Package details",
  "When does it need to move?",
  "Your details",
];

export default function EnquiryForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);

  useEffect(() => {
    fetch("/api/pricing-config")
      .then((r) => r.json())
      .then(setPricingConfig)
      .catch(() => {});
  }, []);

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Package validation
  const weight = Number(data.weightKg);
  const length = Number(data.lengthCm);
  const width = Number(data.widthCm);
  const height = Number(data.heightCm);

  const weightError =
    data.weightKg === ""
      ? "Please enter the package weight."
      : !Number.isFinite(weight) || weight <= 0
      ? "Please enter a valid weight greater than 0 kg."
      : weight > LIMITS.maxWeightKg
      ? `That's a lot — please confirm (max ${LIMITS.maxWeightKg.toLocaleString()} kg).`
      : "";

  const dimsProvided = data.lengthCm || data.widthCm || data.heightCm;
  const dimsError = !dimsProvided
    ? ""
    : [length, width, height].some((d) => !Number.isFinite(d) || d <= 0)
    ? "Length, width, and height must all be valid numbers greater than 0."
    : [length, width, height].some((d) => d > LIMITS.maxDimCm)
    ? `That dimension seems too large (max ${LIMITS.maxDimCm}cm).`
    : "";

  const packageValid = !weightError && !dimsError && !!dimsProvided && data.packageConfirmed;

  const volumeM3 = dimsProvided && !dimsError ? (length * width * height) / 1_000_000 : 0;

  // Live estimate — only shown once we have enough to compute one honestly.
  const sameCity = data.origin && data.destination && data.origin.trim().toLowerCase() === data.destination.trim().toLowerCase();
  const scope: DeliveryScope = sameCity ? "local" : "regional";
  const distanceKm = scope === "regional" ? lookupDistance(data.origin, data.destination) : 0;
  const distanceKnown = scope === "local" || !!distanceKm;

  const category: GoodsCategory =
    data.goodsType === "Temperature-controlled"
      ? "cold_chain"
      : data.goodsType === "Containerised"
      ? "containerized"
      : "general";

  const urgency: QuoteUrgency =
    data.timeline === "This week"
      ? "this_week"
      : data.timeline === "Within 2 weeks"
      ? "two_weeks"
      : data.timeline === "This month"
      ? "this_month"
      : "flexible";

  const estimateReady = !weightError && !dimsError && !!dimsProvided && !!data.origin && !!data.destination && distanceKnown;

  const estimate = useMemo(() => {
    if (!estimateReady) return null;
    return calculateQuote(
      {
        category,
        weightKg: weight,
        volumeM3,
        distanceKm: distanceKm || 0,
        scope,
        urgency,
        crossBorder: isCrossBorder(data.origin, data.destination),
      },
      pricingConfig
    );
  }, [estimateReady, category, weight, volumeM3, distanceKm, scope, urgency, data.origin, data.destination, pricingConfig]);

  const canSubmit = data.name && data.phone && data.email;
  const canContinue =
    (step === 1 ? !!data.origin : true) &&
    (step === 2 ? !!data.destination : true) &&
    (step === 3 ? packageValid : true);

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const details = `Weight: ${data.weightKg}kg · Dimensions: ${data.lengthCm}×${data.widthCm}×${data.heightCm}cm (${volumeM3.toFixed(
        2
      )} m³)`;
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, details }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Failed to submit");
      }
      const json = await res.json();
      setTrackingNumber(json.trackingNumber);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong — please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-deck-maroon text-paper rounded-lg p-10 text-center">
        <p className="font-mono text-signal-amber text-xs mb-3">ENQUIRY RECEIVED</p>
        <h3 className="font-display font-bold text-2xl mb-3">
          We&apos;ve got your shipment details.
        </h3>
        <p className="text-fog max-w-md mx-auto mb-4">
          A dispatcher will contact you at {data.phone || data.email} with a
          route plan and quote — usually within one business day.
        </p>
        <div className="inline-block bg-cargo-maroon rounded px-6 py-3">
          <p className="text-xs font-mono text-fog">YOUR REFERENCE NUMBER</p>
          <p className="font-mono text-xl text-signal-amber font-semibold">{trackingNumber}</p>
        </div>
        {estimate && (
          <p className="text-sm text-fog mt-4">
            Estimated range: {formatCurrency(estimate.total * 0.9)} – {formatCurrency(estimate.total * 1.15)}
          </p>
        )}
        <p className="text-xs text-fog mt-4">
          A full tracking number will be sent to your email once the order is confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cargo-maroon text-paper rounded-lg p-6 md:p-10">
      <div className="flex items-center gap-2 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i <= step ? "bg-signal-amber" : "bg-deck-maroon"
            }`}
          />
        ))}
      </div>

      <p className="text-xs font-mono text-fog mb-2">
        STEP {step + 1} OF {steps.length}
      </p>
      <h3 className="font-display font-bold text-2xl mb-6">{steps[step]}</h3>

      {step === 0 && (
        <div className="grid grid-cols-2 gap-3">
          {["General cargo", "Containerised", "Abnormal / project", "Temperature-controlled"].map(
            (opt) => (
              <button
                key={opt}
                onClick={() => update("goodsType", opt)}
                className={`text-left p-4 rounded border text-sm ${
                  data.goodsType === opt
                    ? "border-signal-amber bg-deck-maroon"
                    : "border-fog/40"
                }`}
              >
                {opt}
              </button>
            )
          )}
        </div>
      )}

      {step === 1 && (
        <LocationInput
          value={data.origin}
          onChange={(v) => update("origin", v)}
          placeholder="e.g. Germiston, Gauteng"
          dark
        />
      )}

      {step === 2 && (
        <LocationInput
          value={data.destination}
          onChange={(v) => update("destination", v)}
          placeholder="e.g. Lusaka, Zambia"
          dark
        />
      )}

      {step === 3 && (
        <div>
          <label className="text-xs font-mono text-fog">Weight (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            value={data.weightKg}
            onChange={(e) => update("weightKg", e.target.value)}
            placeholder="e.g. 250"
            className="w-full bg-deck-maroon rounded p-3 mt-1 mb-1 text-paper placeholder:text-fog outline-none"
          />
          {weightError && data.weightKg !== "" && (
            <p className="text-xs text-status-hold mb-3">{weightError}</p>
          )}

          <label className="text-xs font-mono text-fog mt-3 block mb-2">Package size</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {Object.entries(PRESETS).map(([name, dims]) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  update("lengthCm", dims.l);
                  update("widthCm", dims.w);
                  update("heightCm", dims.h);
                }}
                className={`text-xs p-2.5 rounded border ${
                  data.lengthCm === dims.l && data.widthCm === dims.w && data.heightCm === dims.h
                    ? "border-signal-amber bg-deck-maroon"
                    : "border-fog/40"
                }`}
              >
                {name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                update("lengthCm", "");
                update("widthCm", "");
                update("heightCm", "");
              }}
              className="text-xs p-2.5 rounded border border-fog/40"
            >
              Custom
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={data.lengthCm}
              onChange={(e) => update("lengthCm", e.target.value)}
              placeholder="L (cm)"
              className="bg-deck-maroon rounded p-3 text-paper placeholder:text-fog outline-none text-sm"
            />
            <input
              type="number"
              inputMode="decimal"
              value={data.widthCm}
              onChange={(e) => update("widthCm", e.target.value)}
              placeholder="W (cm)"
              className="bg-deck-maroon rounded p-3 text-paper placeholder:text-fog outline-none text-sm"
            />
            <input
              type="number"
              inputMode="decimal"
              value={data.heightCm}
              onChange={(e) => update("heightCm", e.target.value)}
              placeholder="H (cm)"
              className="bg-deck-maroon rounded p-3 text-paper placeholder:text-fog outline-none text-sm"
            />
          </div>
          {dimsError && <p className="text-xs text-status-hold mt-2">{dimsError}</p>}

          {dimsProvided && !dimsError && (
            <>
              <PackageVisual lengthCm={length} widthCm={width} heightCm={height} />
              <p className="text-center text-xs font-mono text-fog -mt-2 mb-3">
                ≈ {volumeM3.toFixed(2)} m³
              </p>
              <label className="flex items-start gap-2 text-xs text-fog">
                <input
                  type="checkbox"
                  checked={data.packageConfirmed}
                  onChange={(e) => update("packageConfirmed", e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  I confirm these package details are accurate. (The image above is a visual
                  guide based on what I entered, not an exact rendering.)
                </span>
              </label>
            </>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="grid grid-cols-2 gap-3">
          {["This week", "Within 2 weeks", "This month", "Flexible / planning ahead"].map(
            (opt) => (
              <button
                key={opt}
                onClick={() => update("timeline", opt)}
                className={`text-left p-4 rounded border text-sm ${
                  data.timeline === opt
                    ? "border-signal-amber bg-deck-maroon"
                    : "border-fog/40"
                }`}
              >
                {opt}
              </button>
            )
          )}
        </div>
      )}

      {step === 5 && (
        <div className="grid gap-3">
          <input
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Full name"
            className="w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none"
          />
          <input
            value={data.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Company (optional)"
            className="w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none"
          />
          <input
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Phone number"
            className="w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none"
          />
          <input
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none"
          />
        </div>
      )}

      {/* Live estimate */}
      {step >= 4 && estimate && (
        <div className="bg-deck-maroon rounded-lg p-4 mt-6 border border-signal-amber/30">
          <p className="text-xs font-mono text-signal-amber mb-1">ESTIMATED PRICE RANGE</p>
          <p className="font-display font-bold text-2xl">
            {formatCurrency(estimate.total * 0.9)} – {formatCurrency(estimate.total * 1.15)}
          </p>
          <p className="text-xs text-fog mt-1">
            A ballpark based on what you've entered — your dispatcher confirms the exact quote.
          </p>
        </div>
      )}
      {step >= 4 && !estimate && data.origin && data.destination && !distanceKnown && (
        <p className="text-xs text-fog mt-6">
          We don't have a distance on file for this exact route yet — your dispatcher will price
          it directly.
        </p>
      )}

      {/* Running summary */}
      {(data.origin || data.destination) && step > 0 && (
        <p className="text-xs font-mono text-fog mt-6">
          {data.origin || "Origin"} → {data.destination || "Destination"}
          {data.goodsType ? ` · ${data.goodsType}` : ""}
          {data.weightKg ? ` · ${data.weightKg}kg` : ""}
        </p>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={back}
          disabled={step === 0}
          className="text-sm text-fog disabled:opacity-30"
        >
          ← Back
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={next}
            disabled={!canContinue}
            className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-2.5 rounded text-sm disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-2.5 rounded text-sm disabled:opacity-40"
          >
            {submitting ? "Submitting…" : "Submit enquiry"}
          </button>
        )}
      </div>
      {error && <p className="text-status-hold text-sm mt-4">{error}</p>}
    </div>
  );
}
