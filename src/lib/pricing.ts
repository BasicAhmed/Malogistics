export type GoodsCategory = "general" | "containerized" | "cold_chain";
export type QuoteUrgency = "flexible" | "this_month" | "two_weeks" | "this_week";
export type DeliveryScope = "local" | "regional";

export interface QuoteInput {
  category: GoodsCategory;
  weightKg: number;
  volumeM3: number;
  distanceKm: number;
  scope: DeliveryScope;
  urgency: QuoteUrgency;
  crossBorder: boolean;
}

export interface QuoteBreakdown {
  chargeableWeightKg: number;
  chargeableTons: number;
  rateUsed: number; // per ton-km, or flat local rate
  baseFreight: number;
  urgencySurcharge: number;
  urgencyPct: number;
  coldChainFee: number;
  containerHandlingFee: number;
  crossBorderClearanceFee: number;
  minimumApplied: boolean;
  subtotal: number;
  vat: number;
  total: number;
}

// Volumetric conversion for road freight: 1 m³ ≈ 333 kg chargeable.
const VOLUMETRIC_DIVISOR = 333;

// Rate per ton per km, by category (long-haul / regional).
const RATE_PER_TON_KM: Record<GoodsCategory, number> = {
  general: 2.2,
  containerized: 2.6,
  cold_chain: 3.1,
};

// Flat local (in-city) base rates, by category — covers a base parcel up
// to 500kg / 2m³, plus a per-extra-ton rate beyond that.
const LOCAL_BASE_RATE: Record<GoodsCategory, number> = {
  general: 950,
  containerized: 1400,
  cold_chain: 1600,
};
const LOCAL_EXTRA_PER_TON: Record<GoodsCategory, number> = {
  general: 380,
  containerized: 450,
  cold_chain: 520,
};
const LOCAL_BASE_ALLOWANCE_TONS = 0.5;

const URGENCY_PCT: Record<QuoteUrgency, number> = {
  flexible: 0,
  this_month: 5,
  two_weeks: 10,
  this_week: 25,
};

const MINIMUM_CHARGE = 1500;
const COLD_CHAIN_HANDLING_FEE = 850;
const CONTAINER_HANDLING_FEE = 1200;
const CROSS_BORDER_CLEARANCE_FEE = 2500;
const VAT_RATE = 0.15;

export function calculateQuote(input: QuoteInput): QuoteBreakdown {
  const chargeableWeightKg = Math.max(input.weightKg, input.volumeM3 * VOLUMETRIC_DIVISOR);
  const chargeableTons = chargeableWeightKg / 1000;

  let baseFreight: number;
  let rateUsed: number;

  if (input.scope === "local") {
    rateUsed = LOCAL_EXTRA_PER_TON[input.category];
    const extraTons = Math.max(0, chargeableTons - LOCAL_BASE_ALLOWANCE_TONS);
    baseFreight = LOCAL_BASE_RATE[input.category] + extraTons * rateUsed;
  } else {
    rateUsed = RATE_PER_TON_KM[input.category];
    baseFreight = chargeableTons * rateUsed * Math.max(input.distanceKm, 0);
  }

  let minimumApplied = false;
  if (baseFreight < MINIMUM_CHARGE) {
    baseFreight = MINIMUM_CHARGE;
    minimumApplied = true;
  }

  const urgencyPct = URGENCY_PCT[input.urgency];
  const urgencySurcharge = baseFreight * (urgencyPct / 100);

  const coldChainFee = input.category === "cold_chain" ? COLD_CHAIN_HANDLING_FEE : 0;
  const containerHandlingFee = input.category === "containerized" ? CONTAINER_HANDLING_FEE : 0;
  const crossBorderClearanceFee = input.crossBorder ? CROSS_BORDER_CLEARANCE_FEE : 0;

  const subtotal =
    baseFreight + urgencySurcharge + coldChainFee + containerHandlingFee + crossBorderClearanceFee;

  // Cross-border freight is typically zero-rated for South African VAT —
  // flag it but let the admin confirm; domestic legs charge standard VAT.
  const vat = input.crossBorder ? 0 : subtotal * VAT_RATE;
  const total = subtotal + vat;

  return {
    chargeableWeightKg,
    chargeableTons,
    rateUsed,
    baseFreight,
    urgencySurcharge,
    urgencyPct,
    coldChainFee,
    containerHandlingFee,
    crossBorderClearanceFee,
    minimumApplied,
    subtotal,
    vat,
    total,
  };
}

export const CATEGORY_LABELS: Record<GoodsCategory, string> = {
  general: "General cargo",
  containerized: "Containerised",
  cold_chain: "Temperature-controlled",
};

export const URGENCY_LABELS: Record<QuoteUrgency, string> = {
  flexible: "Flexible / planning ahead",
  this_month: "This month",
  two_weeks: "Within 2 weeks",
  this_week: "This week (urgent)",
};
