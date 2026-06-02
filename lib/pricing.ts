/**
 * E-foil rental pricing.
 *
 * All money values are integer cents (EUR). Day counts are inclusive
 * of both start and end date (a booking on 2025-07-01..2025-07-01 = 1 day).
 *
 * Rules:
 *   1. 1-6 days: dailyPrice × n, then apply a multi-day discount tier:
 *      1-2 days  → 0%
 *      3-4 days  → 10%
 *      5-6 days  → 15%
 *   2. 7+ days: charge weeklyPrice per full week, then remaining days at
 *      dailyPrice with the tier discount applied to the leftover days only.
 *   3. Monotonic clamp: a booking of N days is never cheaper than N-1 days.
 *
 * Discount tiers live here as exported constants so they can be tuned
 * without rewriting the algorithm.
 */

export type DiscountTier = {
  /** Inclusive lower bound (days). */
  minDays: number;
  /** Inclusive upper bound (days). */
  maxDays: number;
  /** Percentage off, 0-100. */
  pct: number;
};

export const DAY_DISCOUNT_TIERS: readonly DiscountTier[] = [
  { minDays: 1, maxDays: 2, pct: 0 },
  { minDays: 3, maxDays: 4, pct: 10 },
  { minDays: 5, maxDays: 6, pct: 15 },
];

export const DAYS_PER_WEEK = 7;

export type Quote = {
  days: number;
  dailyPrice: number;
  weeklyPrice: number;
  subtotal: number;
  discountPct: number;
  discount: number;
  total: number;
};

export type PricingInput = {
  days: number;
  dailyPrice: number;
  weeklyPrice: number;
};

export function tierFor(days: number): DiscountTier {
  if (days <= 0) return { minDays: 0, maxDays: 0, pct: 0 };
  for (const tier of DAY_DISCOUNT_TIERS) {
    if (days >= tier.minDays && days <= tier.maxDays) return tier;
  }
  // Anything >= 7 lands in the weekly regime; the leftover-day part picks
  // up its own tier from this same table.
  return DAY_DISCOUNT_TIERS[DAY_DISCOUNT_TIERS.length - 1];
}

function applyPct(amount: number, pct: number): number {
  return Math.round((amount * pct) / 100);
}

/** Raw quote calculation, before the monotonic clamp. */
function quoteRaw({ days, dailyPrice, weeklyPrice }: PricingInput): Quote {
  if (days < 1) {
    return {
      days: 0,
      dailyPrice,
      weeklyPrice,
      subtotal: 0,
      discountPct: 0,
      discount: 0,
      total: 0,
    };
  }

  if (days < DAYS_PER_WEEK) {
    const tier = tierFor(days);
    const subtotal = dailyPrice * days;
    const discount = applyPct(subtotal, tier.pct);
    return {
      days,
      dailyPrice,
      weeklyPrice,
      subtotal,
      discountPct: tier.pct,
      discount,
      total: subtotal - discount,
    };
  }

  // 7+ days: weeks at weekly price + remainder at daily with tier discount.
  const weeks = Math.floor(days / DAYS_PER_WEEK);
  const remainder = days - weeks * DAYS_PER_WEEK;

  const weekSubtotal = weeklyPrice * weeks;
  const remainderTier = tierFor(remainder);
  const remainderSubtotal = dailyPrice * remainder;
  const remainderDiscount = applyPct(remainderSubtotal, remainderTier.pct);
  const remainderTotal = remainderSubtotal - remainderDiscount;

  const subtotal = weekSubtotal + remainderSubtotal;
  const total = weekSubtotal + remainderTotal;
  const discount = subtotal - total;
  const discountPct = subtotal > 0 ? Math.round((discount * 100) / subtotal) : 0;

  return {
    days,
    dailyPrice,
    weeklyPrice,
    subtotal,
    discountPct,
    discount,
    total,
  };
}

/**
 * Public entry point: applies the monotonic clamp so a longer booking
 * never costs less than a shorter one. The clamp inflates `total` only;
 * `subtotal` and `discount` are re-derived to stay self-consistent.
 */
export function quote(input: PricingInput): Quote {
  const raw = quoteRaw(input);
  if (raw.days <= 1) return raw;

  const prev = quote({ ...input, days: raw.days - 1 });
  if (raw.total >= prev.total) return raw;

  // Inflate to match previous-day total, preserve gross subtotal,
  // recompute discount + pct.
  const total = prev.total;
  const discount = Math.max(0, raw.subtotal - total);
  const discountPct =
    raw.subtotal > 0 ? Math.round((discount * 100) / raw.subtotal) : 0;
  return { ...raw, total, discount, discountPct };
}

/** Inclusive day count between two ISO date strings (YYYY-MM-DD). */
export function inclusiveDays(startISO: string, endISO: string): number {
  const start = Date.parse(startISO + "T00:00:00Z");
  const end = Date.parse(endISO + "T00:00:00Z");
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0;
  return Math.round((end - start) / 86_400_000) + 1;
}

/** Format integer cents as a localized EUR string. */
export function formatPrice(cents: number, locale = "sl-SI"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/* ─────────────────────────────────────────────────────────────────────
 * Package presets — fixed-duration rentals shown as marketing cards.
 * Each package compiles to either a half-hour single-session price or
 * a multi-day quote via `quote()`.
 * ──────────────────────────────────────────────────────────────────── */

export type PackageId =
  | "30min"
  | "day1"
  | "day2"
  | "day3"
  | "week1"
  | "week2";

export type PackageDef = {
  id: PackageId;
  days: number; // 0 for the 30-min taster
  isHalfHour?: boolean;
};

export const PACKAGES: readonly PackageDef[] = [
  { id: "30min", days: 0, isHalfHour: true },
  { id: "day1", days: 1 },
  { id: "day2", days: 2 },
  { id: "day3", days: 3 },
  { id: "week1", days: 7 },
  { id: "week2", days: 14 },
];

export type BoardPricing = {
  halfHourPrice: number;
  dailyPrice: number;
  weeklyPrice: number;
};

export function packageTotal(pkg: PackageDef, board: BoardPricing): number {
  if (pkg.isHalfHour) return board.halfHourPrice;
  return quote({
    days: pkg.days,
    dailyPrice: board.dailyPrice,
    weeklyPrice: board.weeklyPrice,
  }).total;
}
