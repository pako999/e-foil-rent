"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Board } from "@/db/schema";
import {
  inclusiveDays,
  quote,
  formatPrice,
  PACKAGES,
  type PackageId,
} from "@/lib/pricing";
import type { Locale } from "@/i18n/request";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "err"; code: "generic" | "unavailable" };

const QUICK_PACKAGES: { id: PackageId; labelKey: string }[] = [
  { id: "30min", labelKey: "30min" },
  { id: "day1", labelKey: "day1" },
  { id: "day2", labelKey: "day2" },
  { id: "day3", labelKey: "day3" },
  { id: "week1", labelKey: "week1" },
  { id: "week2", labelKey: "week2" },
];

function addDaysISO(isoStart: string, days: number): string {
  const d = new Date(isoStart + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days - 1);
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
  const intlLocale = locale === "sl" ? "sl-SI" : "en-IE";

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
  const [website, setWebsite] = useState("");
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const board = useMemo(
    () => boards.find((b) => b.id === boardId) ?? null,
    [boards, boardId],
  );

  // Preselect board/package from URL hash (`#book?board=2&pkg=day3`).
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
    const id = Number(params.get("board"));
    if (id && boards.some((b) => b.id === id)) setBoardId(id);
    const pkg = params.get("pkg") as PackageId | null;
    if (pkg && PACKAGES.some((p) => p.id === pkg)) applyPackage(pkg);
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
    } else {
      const start = startDate || today;
      setStartDate(start);
      setEndDate(addDaysISO(start, pkg.days));
    }
  }

  const days = inclusiveDays(startDate, endDate);
  const q =
    board && days > 0
      ? quote({
          days,
          dailyPrice: board.dailyPrice,
          weeklyPrice: board.weeklyPrice,
        })
      : null;

  // For 30-min taster, show the board's halfHourPrice instead of day-based.
  const isHalfHour = activePkg === "30min";
  const displayTotal =
    isHalfHour && board ? board.halfHourPrice : q?.total ?? 0;

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
          customerName,
          email,
          phone,
          startDate,
          endDate,
          experienceLevel,
          bookingType,
          notes: (pkgNote + (notes || "")).trim() || null,
          website,
        }),
      });

      if (res.ok) {
        setStatus({ kind: "ok" });
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
      <section id="book" className="bg-sand/60 border-y border-sun/30 scroll-mt-20">
        <div className="container-x py-20 max-w-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="h-display text-4xl text-ocean mb-4">
            {t("successTitle")}
          </h2>
          <p className="text-ocean/80 text-lg">{t("successBody")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="bg-foam scroll-mt-20">
      <div className="container-x py-20 grid lg:grid-cols-[1fr,360px] gap-12">
        <div>
          <h2 className="h-display text-4xl md:text-5xl text-ocean mb-3">
            {t("title")}
          </h2>
          <p className="text-ocean/70 mb-8 max-w-xl">{t("subtitle")}</p>

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
                    {b.name} — {formatPrice(b.dailyPrice, intlLocale)}/d
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
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {t("errorUnavailable")}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{t("experience")}</label>
                <div className="flex rounded-lg overflow-hidden border border-ocean/15">
                  <button
                    type="button"
                    onClick={() => setExperienceLevel("beginner")}
                    className={`flex-1 px-3 py-2 transition ${experienceLevel === "beginner" ? "bg-ocean text-white" : "bg-white text-ocean hover:bg-ocean/5"}`}
                  >
                    {t("experienceBeginner")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExperienceLevel("experienced")}
                    className={`flex-1 px-3 py-2 border-l border-ocean/15 transition ${experienceLevel === "experienced" ? "bg-ocean text-white" : "bg-white text-ocean hover:bg-ocean/5"}`}
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
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
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

        <aside className="bg-gradient-to-br from-ocean to-ocean-deep text-white p-8 rounded-2xl h-fit lg:sticky lg:top-24 shadow-cardHover">
          <p className="font-mono text-xs uppercase tracking-widest text-sun-light mb-3">
            💸 {t("priceTitle")}
          </p>
          {board && (isHalfHour || q) ? (
            <div>
              <p className="font-display text-4xl">
                {formatPrice(displayTotal, intlLocale)}
              </p>
              <p className="font-mono text-sm text-white/70 mt-2">
                {isHalfHour
                  ? "30 min · " + board.name
                  : `${t("priceDays", { days: q!.days })} · ${formatPrice(q!.dailyPrice, intlLocale)}/d`}
              </p>
              {!isHalfHour && q && q.discount > 0 && (
                <p className="font-mono text-sm text-sun mt-1">
                  −{q.discountPct}% {t("priceDiscount")} (−
                  {formatPrice(q.discount, intlLocale)})
                </p>
              )}
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between font-display uppercase tracking-wide">
                <span>{t("priceTotal")}</span>
                <span className="text-sun">
                  {formatPrice(displayTotal, intlLocale)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-white/70">{t("noDates")}</p>
          )}
        </aside>
      </div>
    </section>
  );
}
