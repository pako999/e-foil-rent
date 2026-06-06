"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Board } from "@/db/schema";
import {
  inclusiveDays,
  quote,
  formatPrice,
  vatBreakdown,
  PACKAGES,
  type PackageId,
} from "@/lib/pricing";
import { intlLocale as toIntlLocale, type Locale } from "@/i18n/request";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "err"; code: "generic" | "unavailable" };

const QUICK_PACKAGES: { id: PackageId; labelKey: string }[] = [
  { id: "30min", labelKey: "30min" },
  { id: "day1", labelKey: "day1" },
  { id: "weekend", labelKey: "weekend" },
  { id: "week1", labelKey: "week1" },
  { id: "week2", labelKey: "week2" },
];

function addDaysISO(isoStart: string, days: number): string {
  const d = new Date(isoStart + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days - 1);
  return d.toISOString().slice(0, 10);
}

// Find the next Saturday on or after `fromISO`. Used when the user clicks
// the "weekend" quick pick on a weekday — we want the booking to land on
// an actual Sat–Sun, not today + 1.
function nextSaturdayISO(fromISO: string): string {
  const d = new Date(fromISO + "T00:00:00Z");
  const dow = d.getUTCDay(); // 0=Sun, 6=Sat
  const daysUntilSat = (6 - dow + 7) % 7; // 0 if already Saturday
  d.setUTCDate(d.getUTCDate() + daysUntilSat);
  return d.toISOString().slice(0, 10);
}

export function BookingSection({
  boards,
  locale,
}: {
  boards: Board[];
  locale: Locale;
}) {
  const t = useTranslations("booking");
  const tPkg = useTranslations("packages");
  const tPickup = useTranslations("pickup");
  const intlLocale = toIntlLocale(locale);

  const [boardId, setBoardId] = useState<number | "">(boards[0]?.id ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activePkg, setActivePkg] = useState<PackageId | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<
    "beginner" | "experienced"
  >("beginner");
  const [bookingType, setBookingType] = useState<
    "rental" | "lesson" | "rental_lesson"
  >("rental_lesson");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountStatus, setDiscountStatus] = useState<
    | { kind: "idle" }
    | { kind: "checking" }
    | { kind: "ok"; percentOff: number; code: string }
    | { kind: "err"; reason: string }
  >({ kind: "idle" });
  const [website, setWebsite] = useState("");
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const board = useMemo(
    () => boards.find((b) => b.id === boardId) ?? null,
    [boards, boardId],
  );

  // Preselect from URL params (?board=2&pkg=day3) — used for shareable links.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("board"));
    if (id && boards.some((b) => b.id === id)) setBoardId(id);
    const pkg = params.get("pkg") as PackageId | null;
    if (pkg && PACKAGES.some((p) => p.id === pkg)) applyPackage(pkg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards]);

  // Delegated click handler: when a "Rezerviraj" CTA elsewhere on the page
  // has data-pkg-id or data-board-id, apply that selection. The plain
  // href="#book" handles the scroll. This replaces the broken `#book?pkg=…`
  // hash-query trick, which browsers parsed as part of the fragment ID
  // and refused to scroll to.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target || !("closest" in target)) return;
      const pkgEl = target.closest<HTMLElement>("[data-pkg-id]");
      if (pkgEl) {
        const id = pkgEl.dataset.pkgId as PackageId | undefined;
        if (id && PACKAGES.some((p) => p.id === id)) applyPackage(id);
      }
      const boardEl = target.closest<HTMLElement>("[data-board-id]");
      if (boardEl) {
        const id = Number(boardEl.dataset.boardId);
        if (id && boards.some((b) => b.id === id)) setBoardId(id);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards]);

  useEffect(() => {
    if (!board) return;
    const today = new Date();
    const inYear = new Date(today);
    inYear.setFullYear(today.getFullYear() + 1);
    const from = today.toISOString().slice(0, 10);
    const to = inYear.toISOString().slice(0, 10);
    const ctrl = new AbortController();
    fetch(`/api/availability?boardId=${board.id}&from=${from}&to=${to}`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((data: { unavailable?: string[] }) => {
        setUnavailable(new Set(data.unavailable ?? []));
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [board]);

  function applyPackage(id: PackageId) {
    const pkg = PACKAGES.find((p) => p.id === id)!;
    setActivePkg(id);
    const today = new Date().toISOString().slice(0, 10);
    if (pkg.isHalfHour) {
      setStartDate(today);
      setEndDate(today);
      setBookingType("rental_lesson");
    } else if (id === "weekend") {
      // Weekend = Sat → Sun. If user is on a weekday, jump to upcoming
      // Saturday so the fixed price actually matches the rental window.
      const start = nextSaturdayISO(startDate || today);
      setStartDate(start);
      setEndDate(addDaysISO(start, pkg.days));
    } else {
      const start = startDate || today;
      setStartDate(start);
      setEndDate(addDaysISO(start, pkg.days));
    }
  }

  const days = inclusiveDays(startDate, endDate);

  // Auto-detect packages from the picked date range. Lets users get the
  // fixed weekend price (€350) by simply selecting Sat → Sun in the
  // calendar instead of having to remember to click the chip. Same idea
  // for 1-day / 1-week / 2-week ranges.
  useEffect(() => {
    if (activePkg === "30min") return; // taster has its own semantics
    if (!startDate || !endDate || days <= 0) {
      setActivePkg(null);
      return;
    }
    const startDow = new Date(startDate + "T00:00:00Z").getUTCDay();
    let inferred: PackageId | null = null;
    if (days === 2 && startDow === 6) inferred = "weekend";
    else if (days === 14) inferred = "week2";
    else if (days === 7) inferred = "week1";
    else if (days === 1) inferred = "day1";
    setActivePkg(inferred);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, days]);
  const q =
    board && days > 0
      ? quote({
          days,
          dailyPrice: board.dailyPrice,
          weeklyPrice: board.weeklyPrice,
        })
      : null;

  // Fixed-price packages (weekend, 2-week) override the day-based calc.
  const activePkgDef = activePkg
    ? PACKAGES.find((p) => p.id === activePkg)
    : null;
  const isHalfHour = activePkg === "30min";
  const fixedTotal =
    activePkgDef && activePkgDef.fixedTotal !== undefined
      ? activePkgDef.fixedTotal
      : null;
  const preCodeTotal =
    fixedTotal !== null
      ? fixedTotal
      : isHalfHour && board
        ? board.halfHourPrice
        : q?.total ?? 0;
  // Discount code reduces the running total in the side panel so the
  // user sees what they'll actually pay before submitting.
  const codeDiscount =
    discountStatus.kind === "ok"
      ? Math.round((preCodeTotal * discountStatus.percentOff) / 100)
      : 0;
  const displayTotal = Math.max(0, preCodeTotal - codeDiscount);

  const rangeHasBlocked = useMemo(() => {
    if (!startDate || !endDate || days <= 0) return false;
    const start = new Date(startDate + "T00:00:00Z");
    const end = new Date(endDate + "T00:00:00Z");
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      if (unavailable.has(d.toISOString().slice(0, 10))) return true;
    }
    return false;
  }, [startDate, endDate, days, unavailable]);

  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!board || days <= 0 || rangeHasBlocked) return;
    setStatus({ kind: "submitting" });

    const pkgNote = activePkg ? `[Package: ${activePkg}] ` : "";

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: board.id,
          packageId: activePkg ?? null,
          customerName,
          email,
          phone,
          startDate,
          endDate,
          experienceLevel,
          bookingType,
          notes: (pkgNote + (notes || "")).trim() || null,
          discountCode:
            discountStatus.kind === "ok" ? discountStatus.code : null,
          website,
        }),
      });

      if (res.ok) {
        const ok = await res.json().catch(() => ({}));
        // Email delivery failures show up here as a side-channel so the
        // owner can grep them in the browser console without surfacing
        // them to customers (the booking is saved either way).
        if (ok?.emailError) {
          console.error("[booking] saved, but email failed:", ok.emailError);
        }
        setStatus({ kind: "ok" });
        // The success panel replaces the form which sits below the fold,
        // so without an explicit scroll the user sees only the empty space
        // that was the form. Defer until the new DOM is committed.
        requestAnimationFrame(() => {
          document
            .getElementById("book")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
      const data = await res.json().catch(() => ({}));
      const code = data?.error === "dates_unavailable" ? "unavailable" : "generic";
      setStatus({ kind: "err", code });
    } catch {
      setStatus({ kind: "err", code: "generic" });
    }
  }

  if (status.kind === "ok") {
    return (
      <section id="book" className="bg-gold border-y-2 border-ink scroll-mt-20">
        <div className="container-x py-20 max-w-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="h-display text-4xl text-ink mb-4">
            {t("successTitle")}
          </h2>
          <p className="text-ink text-lg">{t("successBody")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="bg-paper border-b-2 border-ink scroll-mt-20">
      <div className="container-x py-12 sm:py-16 lg:py-20 grid lg:grid-cols-[1fr,360px] gap-8 lg:gap-12">
        <div className="min-w-0 order-2 lg:order-1">
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-graphite mb-6 max-w-xl">{t("subtitle")}</p>

          <div className="mb-8 flex items-center gap-3 bg-gold border-2 border-ink px-4 py-3 max-w-xl">
            <span className="text-xl">🚚</span>
            <div className="text-sm text-ink">
              <strong className="font-display uppercase tracking-wide" style={{ fontWeight: 800 }}>
                {tPickup("label")}:
              </strong>{" "}
              {tPickup("cities")}
            </div>
          </div>

          <div className="mb-8">
            <p className="label">{t("quickPick")}</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PACKAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPackage(p.id)}
                  className={`chip ${activePkg === p.id ? "chip-active" : ""}`}
                >
                  {tPkg(`items.${p.labelKey}.duration`)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="board" className="label">{t("selectBoard")}</label>
              <select
                id="board"
                className="field"
                value={boardId}
                onChange={(e) => setBoardId(Number(e.target.value))}
                required
              >
                <option value="" disabled>{t("selectBoardPlaceholder")}</option>
                {boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start" className="label">{t("startDate")}</label>
                <input
                  id="start"
                  type="date"
                  className="field"
                  min={today}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setActivePkg(null);
                  }}
                  required
                />
              </div>
              <div>
                <label htmlFor="end" className="label">{t("endDate")}</label>
                <input
                  id="end"
                  type="date"
                  className="field"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setActivePkg(null);
                  }}
                  required
                />
              </div>
            </div>

            {rangeHasBlocked && (
              <div className="text-sm text-ink bg-gold border-2 border-ink px-3 py-2">
                {t("errorUnavailable")}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{t("experience")}</label>
                <div className="flex border-2 border-ink overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExperienceLevel("beginner")}
                    className={`flex-1 px-3 py-2 transition font-bold ${experienceLevel === "beginner" ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-cream"}`}
                  >
                    {t("experienceBeginner")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExperienceLevel("experienced")}
                    className={`flex-1 px-3 py-2 border-l-2 border-ink transition font-bold ${experienceLevel === "experienced" ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-cream"}`}
                  >
                    {t("experienceExperienced")}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">{t("type")}</label>
                <select
                  className="field"
                  value={bookingType}
                  onChange={(e) =>
                    setBookingType(e.target.value as typeof bookingType)
                  }
                >
                  <option value="rental">{t("typeRental")}</option>
                  <option value="lesson">{t("typeLesson")}</option>
                  <option value="rental_lesson">{t("typeBoth")}</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="label">{t("name")}</label>
                <input
                  id="name"
                  type="text"
                  className="field"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">{t("email")}</label>
                <input
                  id="email"
                  type="email"
                  className="field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="label">{t("phone")}</label>
              <input
                id="phone"
                type="tel"
                className="field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="notes" className="label">{t("notes")}</label>
              <textarea
                id="notes"
                className="field"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="discount" className="label">
                {t("discountLabel")}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="discount"
                  type="text"
                  className="field flex-1 min-w-0 uppercase tracking-widest"
                  placeholder="XXXX-XXXX"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    if (discountStatus.kind !== "idle") {
                      setDiscountStatus({ kind: "idle" });
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!discountCode.trim()) return;
                    setDiscountStatus({ kind: "checking" });
                    try {
                      const res = await fetch("/api/validate-code", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code: discountCode.trim() }),
                      });
                      const data = await res.json();
                      if (data?.ok) {
                        setDiscountStatus({
                          kind: "ok",
                          percentOff: data.percentOff,
                          code: data.code,
                        });
                      } else {
                        setDiscountStatus({
                          kind: "err",
                          reason: data?.reason ?? "not_found",
                        });
                      }
                    } catch {
                      setDiscountStatus({ kind: "err", reason: "not_found" });
                    }
                  }}
                  disabled={
                    !discountCode.trim() || discountStatus.kind === "checking"
                  }
                  className="border-2 border-ink bg-paper px-4 font-display uppercase text-sm hover:bg-gold disabled:opacity-60 whitespace-nowrap"
                  style={{ fontWeight: 800 }}
                >
                  {discountStatus.kind === "checking"
                    ? "…"
                    : t("discountApply")}
                </button>
              </div>
              {discountStatus.kind === "ok" && (
                <p className="mt-1 text-sm text-ink font-mono">
                  ✓ {t("discountApplied", { pct: discountStatus.percentOff })}
                </p>
              )}
              {discountStatus.kind === "err" && (
                <p className="mt-1 text-sm text-red-700 font-mono">
                  ✗ {t(`discountErr.${discountStatus.reason}` as never)}
                </p>
              )}
            </div>

            <div className="hp-field" aria-hidden="true">
              <label htmlFor="website">{t("honeypot")}</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {status.kind === "err" && (
              <div className="text-sm text-ink bg-gold border-2 border-ink px-3 py-2">
                <strong>{t("errorTitle")}</strong>{" "}
                {status.code === "unavailable"
                  ? t("errorUnavailable")
                  : t("errorGeneric")}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={
                status.kind === "submitting" ||
                !board ||
                days <= 0 ||
                rangeHasBlocked
              }
            >
              {status.kind === "submitting" ? t("submitting") : t("submit")} →
            </button>
          </form>
        </div>

        <aside className="bg-ink text-paper p-6 sm:p-8 h-fit lg:sticky lg:top-24 border-2 border-ink order-1 lg:order-2" style={{ boxShadow: "6px 6px 0 0 #FFD600" }}>
          <p className="font-display uppercase tracking-widest text-xs text-gold mb-3" style={{ fontWeight: 800 }}>
            💸 {t("priceTitle")}
          </p>
          {board && (isHalfHour || q || fixedTotal !== null) ? (
            <div>
              <p className="font-display text-5xl text-gold" style={{ fontWeight: 900 }}>
                {formatPrice(displayTotal, intlLocale)}
              </p>
              <p className="font-mono text-sm text-paper/70 mt-2">
                {isHalfHour
                  ? "30 min · " + board.name
                  : fixedTotal !== null && activePkgDef
                    ? `${activePkgDef.days} dni · ${board.name}`
                    : q
                      ? `${t("priceDays", { days: q.days })} · ${formatPrice(q.dailyPrice, intlLocale)}/d`
                      : ""}
              </p>
              {fixedTotal === null && !isHalfHour && q && q.discount > 0 && (
                <p className="font-mono text-sm text-gold mt-1">
                  −{q.discountPct}% {t("priceDiscount")} (−
                  {formatPrice(q.discount, intlLocale)})
                </p>
              )}
              {discountStatus.kind === "ok" && codeDiscount > 0 && (
                <div className="mt-3 pt-3 border-t-2 border-gold/30 space-y-1">
                  <div className="flex justify-between font-mono text-sm text-paper/70">
                    <span>{t("priceOriginal")}</span>
                    <span>{formatPrice(preCodeTotal, intlLocale)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm text-gold">
                    <span>
                      {t("priceCodeDiscount", {
                        pct: discountStatus.percentOff,
                        code: discountStatus.code,
                      })}
                    </span>
                    <span>−{formatPrice(codeDiscount, intlLocale)}</span>
                  </div>
                </div>
              )}
              {(() => {
                const v = vatBreakdown(displayTotal);
                return (
                  <div className="mt-6 pt-6 border-t-2 border-gold/30 space-y-2">
                    <div className="flex justify-between font-mono text-sm text-paper/70">
                      <span>{t("netLabel")}</span>
                      <span>{formatPrice(v.net, intlLocale)}</span>
                    </div>
                    <div className="flex justify-between font-mono text-sm text-paper/70">
                      <span>{t("vatLabel")}</span>
                      <span>{formatPrice(v.vat, intlLocale)}</span>
                    </div>
                    <div className="flex justify-between font-display uppercase tracking-wide pt-3 mt-1 border-t-2 border-gold/30" style={{ fontWeight: 800 }}>
                      <span>{t("totalWithVat")}</span>
                      <span className="text-gold">
                        {formatPrice(v.gross, intlLocale)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p className="text-paper/70">{t("noDates")}</p>
          )}
        </aside>
      </div>
    </section>
  );
}
