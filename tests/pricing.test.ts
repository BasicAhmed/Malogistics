import { describe, it, expect } from "vitest";
import { calculateQuote, validateQuoteInput, DEFAULT_PRICING_CONFIG, QuoteInput } from "../src/lib/pricing";

const config = DEFAULT_PRICING_CONFIG;

const base: QuoteInput = {
  category: "general",
  weightKg: 500,
  volumeM3: 2,
  distanceKm: 580,
  scope: "regional",
  urgency: "flexible",
  crossBorder: false,
};

describe("calculateQuote", () => {
  it("adds each cost component exactly once (no double charging)", () => {
    const result = calculateQuote(base, config);
    const expectedPreTax =
      config.basePrice +
      base.weightKg * config.pricePerKg +
      base.distanceKm * config.pricePerKm +
      base.volumeM3 * config.pricePerVolume;
    // subtotal (post-urgency, pre-tax) should equal pre-tax total when urgency is 0%
    expect(result.subtotal).toBeCloseTo(expectedPreTax, 2);
  });

  it("charges zero distance cost for local scope", () => {
    const result = calculateQuote({ ...base, scope: "local" }, config);
    expect(result.distanceCost).toBe(0);
  });

  it("applies the correct category multiplier", () => {
    const general = calculateQuote({ ...base, category: "general" }, config);
    const cold = calculateQuote({ ...base, category: "cold_chain" }, config);
    // cold chain multiplier > general multiplier, so variable costs scale up
    expect(cold.weightCost).toBeGreaterThan(general.weightCost);
    expect(cold.categoryMultiplier).toBe(config.categoryMultiplierColdChain);
  });

  it("adds fixed fees only for the relevant category", () => {
    const general = calculateQuote({ ...base, category: "general" }, config);
    const cold = calculateQuote({ ...base, category: "cold_chain" }, config);
    const containerized = calculateQuote({ ...base, category: "containerized" }, config);
    expect(general.coldChainFee).toBe(0);
    expect(general.containerHandlingFee).toBe(0);
    expect(cold.coldChainFee).toBe(config.coldChainFee);
    expect(containerized.containerHandlingFee).toBe(config.containerHandlingFee);
  });

  it("applies the cross-border fee and zero-rates VAT when cross-border", () => {
    const domestic = calculateQuote({ ...base, crossBorder: false }, config);
    const crossBorder = calculateQuote({ ...base, crossBorder: true }, config);
    expect(crossBorder.crossBorderFee).toBe(config.crossBorderFee);
    expect(crossBorder.taxPct).toBe(0);
    expect(crossBorder.tax).toBe(0);
    expect(domestic.taxPct).toBe(config.taxPct);
  });

  it("applies urgency surcharge as a percentage of subtotal before urgency", () => {
    const flexible = calculateQuote({ ...base, urgency: "flexible" }, config);
    const urgent = calculateQuote({ ...base, urgency: "this_week" }, config);
    expect(urgent.urgencySurcharge).toBeGreaterThan(0);
    expect(flexible.urgencySurcharge).toBe(0);
    expect(urgent.total).toBeGreaterThan(flexible.total);
  });

  it("enforces the minimum charge floor for tiny shipments", () => {
    const tiny = calculateQuote(
      { ...base, weightKg: 1, volumeM3: 0.01, distanceKm: 5 },
      config
    );
    expect(tiny.minimumApplied).toBe(true);
    expect(tiny.subtotal).toBe(config.minimumCharge);
  });

  it("never produces a negative total", () => {
    const result = calculateQuote({ ...base, weightKg: 0.001, volumeM3: 0.001, distanceKm: 1 }, config);
    expect(result.total).toBeGreaterThan(0);
  });
});

describe("validateQuoteInput", () => {
  it("rejects zero or negative weight", () => {
    expect(validateQuoteInput({ ...base, weightKg: 0 }).length).toBeGreaterThan(0);
    expect(validateQuoteInput({ ...base, weightKg: -5 }).length).toBeGreaterThan(0);
  });

  it("rejects missing distance for regional scope", () => {
    const errors = validateQuoteInput({ ...base, scope: "regional", distanceKm: 0 });
    expect(errors.some((e) => e.field === "distanceKm")).toBe(true);
  });

  it("allows zero distance for local scope", () => {
    const errors = validateQuoteInput({ ...base, scope: "local", distanceKm: 0 });
    expect(errors.some((e) => e.field === "distanceKm")).toBe(false);
  });

  it("rejects absurdly large weight", () => {
    const errors = validateQuoteInput({ ...base, weightKg: 999999 });
    expect(errors.some((e) => e.field === "weightKg")).toBe(true);
  });

  it("passes valid input with no errors", () => {
    expect(validateQuoteInput(base)).toHaveLength(0);
  });
});
