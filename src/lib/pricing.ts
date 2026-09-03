export type GoodsCategory = "general" | "containerized" | "cold_chain";
export type QuoteUrgency = "flexible" | "this_month" | "two_weeks" | "this_week";
export type DeliveryScope = "local" | "regional";

export interface PricingConfig {
  basePrice: number;
  localBasePrice: number;
  pricePerKg: number;
  pricePerKm: number;
  pricePerVolume: number;

  categoryMultiplierGeneral: number;
  categoryMultiplierContainerized: number;
  categoryMultiplierColdChain: number;

  coldChainFee: number;
  containerHandlingFee: number;
  crossBorderFee: number;

  urgencyFlexiblePct: number;
  urgencyThisMonthPct: number;
  urgencyTwoWeeksPct: number;
  urgencyThisWeekPct: number;

  taxPct: number;
  minimumCharge: number;
}

// Fallback only — used if the pricing_config row can't be loaded for some
// reason. The real values always come from the database (see store.ts
// getPricingConfig) so the admin's changes actually take effect.
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  basePrice: 500,
  localBasePrice: 400,
  pricePerKg: 8,
  pricePerKm: 4.5,
  pricePerVolume: 120,
  categoryMultiplierGeneral: 1.0,
  categoryMultiplierContainerized: 1.15,
  categoryMultiplierColdChain: 1.35,
  coldChainFee: 850,
  containerHandlingFee: 1200,
  crossBorderFee: 2500,
  urgencyFlexiblePct: 0,
  urgencyThisMonthPct: 5,
  urgencyTwoWeeksPct: 10,
  urgencyThisWeekPct: 25,
  taxPct: 15,
  minimumCharge: 1500,
};

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
  basePrice: number;
  weightCost: number;
  distanceCost: number;
  volumeCost: number;
  categoryMultiplier: number;
  coldChainFee: number;
  containerHandlingFee: number;
  crossBorderFee: number;
  urgencyPct: number;
  urgencySurcharge: number;
  minimumApplied: boolean;
  subtotal: number;
  taxPct: number;
  tax: number;
  total: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

const LIMITS = {
  maxWeightKg: 40000, // ~ a full truckload
  maxVolumeM3: 120,
  maxDistanceKm: 6000,
};

export function validateQuoteInput(input: QuoteInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Number.isFinite(input.weightKg) || input.weightKg <= 0) {
    errors.push({ field: "weightKg", message: "Please enter a valid package weight greater than 0 kg." });
  } else if (input.weightKg > LIMITS.maxWeightKg) {
    errors.push({ field: "weightKg", message: `Weight seems too high — please confirm (max ${LIMITS.maxWeightKg.toLocaleString()} kg).` });
  }

  if (!Number.isFinite(input.volumeM3) || input.volumeM3 < 0) {
    errors.push({ field: "volumeM3", message: "Volume can't be negative — enter 0 if unknown." });
  } else if (input.volumeM3 > LIMITS.maxVolumeM3) {
    errors.push({ field: "volumeM3", message: `Volume seems too high — please confirm (max ${LIMITS.maxVolumeM3} m³).` });
  }

  if (input.scope === "regional") {
    if (!Number.isFinite(input.distanceKm) || input.distanceKm <= 0) {
      errors.push({ field: "distanceKm", message: "Please enter a valid distance greater than 0 km for regional shipments." });
    } else if (input.distanceKm > LIMITS.maxDistanceKm) {
      errors.push({ field: "distanceKm", message: `Distance seems too high — please confirm (max ${LIMITS.maxDistanceKm.toLocaleString()} km).` });
    }
  }

  return errors;
}

function categoryMultiplier(category: GoodsCategory, config: PricingConfig): number {
  if (category === "containerized") return config.categoryMultiplierContainerized;
  if (category === "cold_chain") return config.categoryMultiplierColdChain;
  return config.categoryMultiplierGeneral;
}

function urgencyPct(urgency: QuoteUrgency, config: PricingConfig): number {
  switch (urgency) {
    case "this_month":
      return config.urgencyThisMonthPct;
    case "two_weeks":
      return config.urgencyTwoWeeksPct;
    case "this_week":
      return config.urgencyThisWeekPct;
    default:
      return config.urgencyFlexiblePct;
  }
}

// Formula (each factor contributes exactly once — no double charging):
//
//   base            = local flat rate, or regional base price
//   weightCost      = weight(kg) × pricePerKg
//   distanceCost    = distance(km) × pricePerKm      (0 for local scope)
//   volumeCost      = volume(m³) × pricePerVolume
//   variable        = (weightCost + distanceCost + volumeCost) × categoryMultiplier
//   subtotal        = base + variable + categoryFee + crossBorderFee
//   + urgency%      = subtotal × urgencyPct
//   → minimum charge floor applied here if needed
//   + tax%          = (subtotal + urgency) × taxPct   (0 if cross-border / zero-rated)
//   = total
export function calculateQuote(input: QuoteInput, config: PricingConfig): QuoteBreakdown {
  const mult = categoryMultiplier(input.category, config);

  const basePrice = input.scope === "local" ? config.localBasePrice : config.basePrice;
  const weightCost = input.weightKg * config.pricePerKg * mult;
  const distanceCost = input.scope === "local" ? 0 : input.distanceKm * config.pricePerKm * mult;
  const volumeCost = input.volumeM3 * config.pricePerVolume * mult;

  const coldChainFee = input.category === "cold_chain" ? config.coldChainFee : 0;
  const containerHandlingFee = input.category === "containerized" ? config.containerHandlingFee : 0;
  const crossBorderFeeAmt = input.crossBorder ? config.crossBorderFee : 0;

  let subtotal = basePrice + weightCost + distanceCost + volumeCost + coldChainFee + containerHandlingFee + crossBorderFeeAmt;

  const uPct = urgencyPct(input.urgency, config);
  const urgencySurcharge = subtotal * (uPct / 100);

  let subtotalWithUrgency = subtotal + urgencySurcharge;

  let minimumApplied = false;
  if (subtotalWithUrgency < config.minimumCharge) {
    subtotalWithUrgency = config.minimumCharge;
    minimumApplied = true;
  }

  const effectiveTaxPct = input.crossBorder ? 0 : config.taxPct;
  const tax = subtotalWithUrgency * (effectiveTaxPct / 100);
  const total = subtotalWithUrgency + tax;

  return {
    basePrice,
    weightCost,
    distanceCost,
    volumeCost,
    categoryMultiplier: mult,
    coldChainFee,
    containerHandlingFee,
    crossBorderFee: crossBorderFeeAmt,
    urgencyPct: uPct,
    urgencySurcharge,
    minimumApplied,
    subtotal: subtotalWithUrgency,
    taxPct: effectiveTaxPct,
    tax,
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
