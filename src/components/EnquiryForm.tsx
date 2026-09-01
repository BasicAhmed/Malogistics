"use client";

import { useState } from "react";

type FormData = {
  goodsType: string;
  origin: string;
  destination: string;
  details: string;
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
  details: "",
  timeline: "",
  name: "",
  company: "",
  phone: "",
  email: "",
};

const steps = [
  "What are you shipping?",
  "Where is it coming from?",
  "Where is it going?",
  "Shipment details",
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

  const update = (field: keyof FormData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canSubmit = data.name && data.phone && data.email;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      const json = await res.json();
      setTrackingNumber(json.trackingNumber);
      setSubmitted(true);
    } catch {
      setError("Something went wrong — please try again or contact us directly.");
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
        <input
          value={data.origin}
          onChange={(e) => update("origin", e.target.value)}
          placeholder="e.g. Durban, South Africa"
          className="w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none"
        />
      )}

      {step === 2 && (
        <input
          value={data.destination}
          onChange={(e) => update("destination", e.target.value)}
          placeholder="e.g. Lusaka, Zambia"
          className="w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none"
        />
      )}

      {step === 3 && (
        <textarea
          value={data.details}
          onChange={(e) => update("details", e.target.value)}
          placeholder="Approximate size, weight, quantity, or anything else we should know"
          rows={4}
          className="w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none"
        />
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

      {/* Running summary */}
      {(data.origin || data.destination) && step > 0 && (
        <p className="text-xs font-mono text-fog mt-6">
          {data.origin || "Origin"} → {data.destination || "Destination"}
          {data.goodsType ? ` · ${data.goodsType}` : ""}
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
            className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-2.5 rounded text-sm"
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
