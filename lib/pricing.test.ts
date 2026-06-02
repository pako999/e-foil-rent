import { describe, it, expect } from "vitest";
import { quote, inclusiveDays, tierFor } from "./pricing";

// Realistic config: weekly is priced *above* the 6-day discounted total
// (6 * 120 * 0.85 = €612) so the clamp doesn't bind here. Clamp behaviour
// gets its own test case below with pathological inputs.
const DAILY = 12000; // €120/day
const WEEKLY = 70000; // €700/week

describe("tierFor", () => {
  it("returns 0% for 1-2 days", () => {
    expect(tierFor(1).pct).toBe(0);
    expect(tierFor(2).pct).toBe(0);
  });
  it("returns 10% for 3-4 days", () => {
    expect(tierFor(3).pct).toBe(10);
    expect(tierFor(4).pct).toBe(10);
  });
  it("returns 15% for 5-6 days", () => {
    expect(tierFor(5).pct).toBe(15);
    expect(tierFor(6).pct).toBe(15);
  });
});

describe("quote — tier discounts (1-6 days)", () => {
  it("1 day: no discount", () => {
    const q = quote({ days: 1, dailyPrice: DAILY, weeklyPrice: WEEKLY });
    expect(q.subtotal).toBe(12000);
    expect(q.discountPct).toBe(0);
    expect(q.total).toBe(12000);
  });

  it("3 days: 10% discount", () => {
    const q = quote({ days: 3, dailyPrice: DAILY, weeklyPrice: WEEKLY });
    expect(q.subtotal).toBe(36000);
    expect(q.discountPct).toBe(10);
    expect(q.discount).toBe(3600);
    expect(q.total).toBe(32400);
  });

  it("5 days: 15% discount", () => {
    const q = quote({ days: 5, dailyPrice: DAILY, weeklyPrice: WEEKLY });
    expect(q.subtotal).toBe(60000);
    expect(q.discountPct).toBe(15);
    expect(q.total).toBe(51000);
  });
});

describe("quote — weekly + remainder (7+ days)", () => {
  it("7 days: exactly one weekly price", () => {
    const q = quote({ days: 7, dailyPrice: DAILY, weeklyPrice: WEEKLY });
    expect(q.total).toBe(70000);
  });

  it("10 days: 1 week + 3 days at 10% off", () => {
    const q = quote({ days: 10, dailyPrice: DAILY, weeklyPrice: WEEKLY });
    // 70000 + (3 * 12000) - 10% of 36000 = 70000 + 36000 - 3600 = 102400
    expect(q.total).toBe(102400);
  });

  it("14 days: two weekly prices, zero remainder", () => {
    const q = quote({ days: 14, dailyPrice: DAILY, weeklyPrice: WEEKLY });
    expect(q.total).toBe(140000);
  });
});

describe("quote — monotonic clamp", () => {
  it("N+1 days is never cheaper than N days", () => {
    for (let n = 1; n <= 30; n++) {
      const a = quote({ days: n, dailyPrice: DAILY, weeklyPrice: WEEKLY });
      const b = quote({ days: n + 1, dailyPrice: DAILY, weeklyPrice: WEEKLY });
      expect(b.total).toBeGreaterThanOrEqual(a.total);
    }
  });

  it("clamps a pathological case where weekly+0 would beat 6-day total", () => {
    // Construct a scenario: aggressive 6-day discount that exceeds weekly.
    // daily 100, weekly 1000 → 6 days raw with 15% = 510, 7 days = 1000.
    // Now imagine cheap weekly 400: 6 days = 510 - 15% = 510, 7 days raw=400.
    // The clamp should lift 7 days to >= 510.
    const a = quote({ days: 6, dailyPrice: 10000, weeklyPrice: 40000 });
    const b = quote({ days: 7, dailyPrice: 10000, weeklyPrice: 40000 });
    expect(b.total).toBeGreaterThanOrEqual(a.total);
  });
});

describe("inclusiveDays", () => {
  it("counts both endpoints", () => {
    expect(inclusiveDays("2025-07-01", "2025-07-01")).toBe(1);
    expect(inclusiveDays("2025-07-01", "2025-07-07")).toBe(7);
  });
  it("returns 0 for inverted ranges", () => {
    expect(inclusiveDays("2025-07-05", "2025-07-01")).toBe(0);
  });
});
