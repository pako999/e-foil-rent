"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/request";

const DISMISS_KEY = "exitIntent:dismissedAt";
const SHOW_AFTER_MS = 30 * 24 * 60 * 60 * 1000; // re-show after 30 days

type State =
  | { kind: "hidden" }
  | { kind: "open" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "err"; message: string };

/**
 * Exit-intent popup: fires when the mouse leaves the viewport at the top
 * (desktop) or after a long inactivity period (mobile, since exit intent
 * doesn't translate). Visitor types their email, gets a 10 % code via
 * MailerSend. Dismissals are remembered for 30 days in localStorage so
 * we don't harass repeat visitors.
 */
export function ExitIntentPopup({ locale }: { locale: Locale }) {
  const t = useTranslations("exitIntent");
  const [state, setState] = useState<State>({ kind: "hidden" });
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const armedRef = useRef(false);

  useEffect(() => {
    // Don't re-show to people who already saw it recently.
    const dismissedAt = Number(
      window.localStorage.getItem(DISMISS_KEY) ?? "0",
    );
    if (dismissedAt && Date.now() - dismissedAt < SHOW_AFTER_MS) return;

    function trigger() {
      if (armedRef.current) return;
      armedRef.current = true;
      setState({ kind: "open" });
    }
    function onMouseOut(e: MouseEvent) {
      // `relatedTarget` is null when the pointer leaves the viewport.
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    }
    // Mobile fallback: arm after the user has been on the page 40 s and
    // hasn't already interacted with the booking form (#book in view).
    const t1 = window.setTimeout(() => {
      if (window.scrollY < 200) trigger();
    }, 40_000);
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.clearTimeout(t1);
    };
  }, []);

  function close() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setState({ kind: "hidden" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          locale,
          marketingConsent,
          website,
        }),
      });
      if (res.ok) {
        setState({ kind: "ok" });
        window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
        return;
      }
      const data = await res.json().catch(() => ({}));
      setState({
        kind: "err",
        message: data?.error === "rate_limited" ? t("errRate") : t("errGeneric"),
      });
    } catch {
      setState({ kind: "err", message: t("errGeneric") });
    }
  }

  if (state.kind === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="relative w-full max-w-md bg-paper border-2 border-ink"
        style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center border-2 border-ink bg-paper hover:bg-gold"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5 text-ink">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
        {state.kind === "ok" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">📬</div>
            <h2 id="exit-title" className="h-display text-3xl text-ink mb-2">
              {t("okTitle")}
            </h2>
            <p className="text-graphite">{t("okBody")}</p>
            <button
              type="button"
              onClick={close}
              className="btn-primary mt-6 inline-flex"
            >
              {t("close")}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-8">
            <p className="eyebrow mb-2">// {t("eyebrow")}</p>
            <h2 id="exit-title" className="h-display text-3xl sm:text-4xl text-ink mb-2">
              {t("title")}
            </h2>
            <p className="text-graphite mb-5">{t("body")}</p>
            <label htmlFor="exit-email" className="block text-xs font-display uppercase tracking-widest mb-1">
              {t("emailLabel")}
            </label>
            <input
              id="exit-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border-2 border-ink bg-paper px-3 py-2.5 font-mono text-base focus:outline-none focus:ring-0 focus:border-gold"
            />
            {/* Honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{ position: "absolute", left: "-10000px" }}
              aria-hidden="true"
            />
            <label className="mt-4 flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 w-5 h-5 border-2 border-ink shrink-0 accent-gold cursor-pointer"
              />
              <span className="text-xs text-graphite leading-snug">
                {t("consent")}{" "}
                <a
                  href={`/${locale}/legal/privacy`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-ink"
                >
                  {t("privacyLink")}
                </a>
                .
              </span>
            </label>
            {state.kind === "err" && (
              <p className="mt-3 text-sm text-red-700 font-mono">{state.message}</p>
            )}
            <button
              type="submit"
              disabled={state.kind === "submitting"}
              className="btn-primary mt-5 w-full disabled:opacity-60"
            >
              {state.kind === "submitting" ? t("submitting") : `${t("cta")} →`}
            </button>
            <p className="mt-3 text-[11px] text-mute font-mono">{t("privacy")}</p>
          </form>
        )}
      </div>
    </div>
  );
}
