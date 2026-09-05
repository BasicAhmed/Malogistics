"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check } from "lucide-react";
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

const STEP_LABELS = ["Goods", "From", "To", "Package", "Timing", "You", "Review"];

// No business WhatsApp number yet — this opens WhatsApp's own contact
// picker so the customer can send the confirmation to themselves or anyone.
// Once there's a business number, set WHATSAPP_NUMBER (digits only, with
// country code, e.g. "27821234567") and the link will go straight to it.
const WHATSAPP_NUMBER = "";

export default function EnquiryForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
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

  const goTo = (s: number) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  };
  const next = () => goTo(Math.min(step + 1, STEP_LABELS.length - 1));
  const back = () => goTo(Math.max(step - 1, 0));

  function selectAndAdvance<K extends keyof FormData>(field: K, value: FormData[K]) {
    update(field, value);
    setTimeout(() => goTo(Math.min(step + 1, STEP_LABELS.length - 1)), 180);
  }

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

  const canSubmit = !!(data.name && data.phone && data.email);
  const canContinue =
    (step === 0 ? !!data.goodsType : true) &&
    (step === 1 ? !!data.origin : true) &&
    (step === 2 ? !!data.destination : true) &&
    (step === 3 ? packageValid : true) &&
    (step === 4 ? !!data.timeline : true) &&
    (step === 5 ? canSubmit : true);

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

  const whatsappMessage = `Hi! Here's my MA Logistics shipment reference: ${trackingNumber}\nRoute: ${data.origin} → ${data.destination}\nI'll use this to track my shipment at malogisticsza.com/track`;
  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-deck-maroon text-paper rounded-lg p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 15 }}
          className="w-14 h-14 rounded-full bg-signal-amber flex items-center justify-center mx-auto mb-5"
        >
          <Check size={28} className="text-cargo-maroon" strokeWidth={3} />
        </motion.div>
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

        <div className="mt-6">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:brightness-95 transition-all"
          >
            <MessageCircle size={18} />
            Send reference to WhatsApp
          </a>
        </div>

        <p className="text-xs text-fog mt-5">
          A full tracking number will be sent to your email once the order is confirmed.
        </p>
      </motion.div>
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -24 : 24, opacity: 0 }),
  };

  return (
    <div className="bg-cargo-maroon text-paper rounded-lg p-6 md:p-10">
      {/* Numbered step indicator */}
      <div className="flex items-center mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => i < step && goTo(i)}
              disabled={i > step}
              className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-colors ${
                i < step
                  ? "bg-signal-amber text-cargo-maroon cursor-pointer"
                  : i === step
                  ? "bg-signal-amber text-cargo-maroon"
                  : "bg-deck-maroon text-fog"
              }`}
            >
              {i < step ? <Check size={13} strokeWidth={3} /> : i + 1}
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div className={`h-px flex-1 mx-1.5 ${i < step ? "bg-signal-amber" : "bg-deck-maroon"}`} />
            )}
          </div>
        ))}
      </div>

      <p className="text-xs font-mono text-fog mb-2">
        STEP {step + 1} OF {STEP_LABELS.length} — {STEP_LABELS[step].toUpperCase()}
      </p>

      <div className="min-h-[220px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">What are you shipping?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["General cargo", "Containerised", "Abnormal / project", "Temperature-controlled"].map(
                    (opt) => (
                      <button
                        key={opt}
                        onClick={() => selectAndAdvance("goodsType", opt)}
                        className={`text-left p-4 rounded border text-sm transition-colors ${
                          data.goodsType === opt
                            ? "border-signal-amber bg-deck-maroon"
                            : "border-fog/40 hover:border-fog"
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">Where is it coming from?</h3>
                <LocationInput
                  value={data.origin}
                  onChange={(v) => update("origin", v)}
                  placeholder="e.g. Germiston, Gauteng"
                  dark
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">Where is it going?</h3>
                <LocationInput
                  value={data.destination}
                  onChange={(v) => update("destination", v)}
                  placeholder="e.g. Lusaka, Zambia"
                  dark
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">Package details</h3>
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
                      className={`text-xs p-2.5 rounded border transition-colors ${
                        data.lengthCm === dims.l && data.widthCm === dims.w && data.heightCm === dims.h
                          ? "border-signal-amber bg-deck-maroon"
                          : "border-fog/40 hover:border-fog"
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
                    className="text-xs p-2.5 rounded border border-fog/40 hover:border-fog"
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
                        I confirm these package details are accurate. (The image above is a
                        visual guide based on what I entered, not an exact rendering.)
                      </span>
                    </label>
                  </>
                )}
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">When does it need to move?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["This week", "Within 2 weeks", "This month", "Flexible / planning ahead"].map(
                    (opt) => (
                      <button
                        key={opt}
                        onClick={() => selectAndAdvance("timeline", opt)}
                        className={`text-left p-4 rounded border text-sm transition-colors ${
                          data.timeline === opt
                            ? "border-signal-amber bg-deck-maroon"
                            : "border-fog/40 hover:border-fog"
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">Your details</h3>
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
              </div>
            )}

            {step === 6 && (
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">Review your shipment</h3>
                <div className="bg-deck-maroon rounded-lg divide-y divide-cargo-maroon">
                  <ReviewRow label="Goods" value={data.goodsType} onEdit={() => goTo(0)} />
                  <ReviewRow label="From" value={data.origin} onEdit={() => goTo(1)} />
                  <ReviewRow label="To" value={data.destination} onEdit={() => goTo(2)} />
                  <ReviewRow
                    label="Package"
                    value={`${data.weightKg}kg · ${data.lengthCm}×${data.widthCm}×${data.heightCm}cm`}
                    onEdit={() => goTo(3)}
                  />
                  <ReviewRow label="Timing" value={data.timeline} onEdit={() => goTo(4)} />
                  <ReviewRow label="Contact" value={`${data.name} · ${data.phone}`} onEdit={() => goTo(5)} />
                </div>

                {estimate && (
                  <div className="bg-signal-amber/10 border border-signal-amber/30 rounded-lg p-4 mt-4">
                    <p className="text-xs font-mono text-signal-amber mb-1">ESTIMATED PRICE RANGE</p>
                    <p className="font-display font-bold text-2xl">
                      {formatCurrency(estimate.total * 0.9)} – {formatCurrency(estimate.total * 1.15)}
                    </p>
                    <p className="text-xs text-fog mt-1">
                      A ballpark based on what you've entered — your dispatcher confirms the exact quote.
                    </p>
                  </div>
                )}
                {!estimate && data.origin && data.destination && !distanceKnown && (
                  <p className="text-xs text-fog mt-4">
                    We don't have a distance on file for this exact route yet — your dispatcher
                    will price it directly.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={back}
          disabled={step === 0}
          className="text-sm text-fog disabled:opacity-30"
        >
          ← Back
        </button>
        {step < STEP_LABELS.length - 1 ? (
          <button
            onClick={next}
            disabled={!canContinue}
            className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-2.5 rounded text-sm disabled:opacity-40 transition-transform hover:-translate-y-0.5"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-2.5 rounded text-sm disabled:opacity-40 transition-transform hover:-translate-y-0.5"
          >
            {submitting ? "Submitting…" : "Submit enquiry"}
          </button>
        )}
      </div>
      {error && <p className="text-status-hold text-sm mt-4">{error}</p>}
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-[10px] font-mono text-fog uppercase">{label}</p>
        <p className="text-sm">{value || "—"}</p>
      </div>
      <button onClick={onEdit} className="text-xs text-signal-amber underline shrink-0 ml-3">
        Edit
      </button>
    </div>
  );
}
