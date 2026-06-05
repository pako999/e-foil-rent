"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  parseConsent,
  serializeConsent,
  consentToGoogle,
  type ConsentState,
} from "@/lib/consent";
import type { Locale } from "@/i18n/request";

const CATEGORIES = ["necessary", "functional", "analytics", "marketing"] as const;
type Category = (typeof CATEGORIES)[number];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    /** Programmatic re-open hook, used by the Footer link. */
    openCookieSettings?: () => void;
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"),
  );
  return match?.[1];
}

export function CookieBanner({ locale }: { locale: Locale }) {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [choices, setChoices] = useState({
    functional: false,
    analytics: false,
    marketing: false,
  });

  // On mount: read existing consent. If none, show the banner.
  useEffect(() => {
    const existing = parseConsent(readCookie("cookie_consent"));
    if (!existing) {
      setVisible(true);
    } else {
      setChoices({
        functional: existing.functional,
        analytics: existing.analytics,
        marketing: existing.marketing,
      });
      // Push the stored choice to Google so tags loaded after the banner
      // mounts see the user's previous decision immediately.
      pushToGoogle(existing);
    }
    // Expose a re-opener so the Footer "Manage cookies" link can call it.
    window.openCookieSettings = () => {
      setVisible(true);
      setShowSettings(true);
    };
    return () => {
      delete window.openCookieSettings;
    };
  }, []);

  const persist = useCallback(
    (next: Omit<ConsentState, "timestamp" | "version">) => {
      document.cookie = serializeConsent(next, {
        secure: window.location.protocol === "https:",
      });
      // Construct a full state object for the Google push.
      pushToGoogle({
        ...next,
        timestamp: Math.floor(Date.now() / 1000),
        version: 1,
      });
      setChoices({
        functional: next.functional,
        analytics: next.analytics,
        marketing: next.marketing,
      });
      setVisible(false);
      setShowSettings(false);
    },
    [],
  );

  const acceptAll = () =>
    persist({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  const rejectAll = () =>
    persist({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  const saveCurrent = () =>
    persist({
      necessary: true,
      ...choices,
    });

  // Lock background scroll while the settings modal is open so the page
  // underneath doesn't drift.
  useEffect(() => {
    if (!showSettings) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showSettings]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop only when the settings modal is open. */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-ink/70 z-[60]"
          onClick={() => setShowSettings(false)}
          aria-hidden="true"
        />
      )}

      {/* Settings modal */}
      {showSettings && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-[70] w-[calc(100vw-1.5rem)] sm:w-[min(600px,calc(100vw-3rem))] max-h-[85vh] overflow-y-auto bg-paper border-2 border-ink"
          style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
        >
          <div className="p-6 sm:p-8">
            <h2
              id="cookie-settings-title"
              className="font-display uppercase tracking-tight text-2xl sm:text-3xl text-ink mb-3"
              style={{ fontWeight: 900 }}
            >
              {t("settings.title")}
            </h2>
            <p className="text-graphite mb-6">{t("settings.intro")}</p>

            <div className="space-y-4">
              {CATEGORIES.map((c) => (
                <CategoryRow
                  key={c}
                  category={c}
                  label={t(`categories.${c}.label`)}
                  body={t(`categories.${c}.body`)}
                  enabled={
                    c === "necessary"
                      ? true
                      : choices[c as Exclude<Category, "necessary">]
                  }
                  locked={c === "necessary"}
                  onToggle={(v) =>
                    setChoices((p) => ({
                      ...p,
                      [c]: v,
                    }))
                  }
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-ink/15">
              <Link
                href={`/${locale}/legal/cookies`}
                className="font-mono text-xs text-ink/70 underline hover:text-ink"
              >
                {t("settings.policyLink")} →
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={saveCurrent} className="btn-primary">
                {t("settings.save")} →
              </button>
              <button type="button" onClick={rejectAll} className="btn-outline">
                {t("rejectAll")}
              </button>
              <button type="button" onClick={acceptAll} className="btn-outline">
                {t("acceptAll")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom banner (always shown if visible && not in settings) */}
      <div
        role="region"
        aria-label={t("banner.aria")}
        className={`fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-paper ${
          showSettings ? "pointer-events-none opacity-0" : ""
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="container-x py-4 sm:py-5 grid lg:grid-cols-[1fr,auto] gap-3 sm:gap-4 items-start lg:items-center">
          <div>
            <p
              className="font-display uppercase tracking-tight text-base sm:text-lg lg:text-xl text-ink mb-1"
              style={{ fontWeight: 900 }}
            >
              🍪 {t("banner.title")}
            </p>
            <p className="text-xs sm:text-sm text-graphite leading-relaxed">
              {t("banner.body")}{" "}
              <Link
                href={`/${locale}/legal/cookies`}
                className="underline hover:text-ink"
              >
                {t("banner.learnMore")}
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto lg:flex lg:flex-row shrink-0">
            <button type="button" onClick={rejectAll} className="btn-outline text-xs px-3 py-2 w-full">
              {t("rejectAll")}
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="btn-outline text-xs px-3 py-2 w-full"
            >
              {t("customize")}
            </button>
            <button type="button" onClick={acceptAll} className="btn-primary text-xs px-3 py-2 w-full">
              {t("acceptAll")} →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function CategoryRow({
  category,
  label,
  body,
  enabled,
  locked,
  onToggle,
}: {
  category: Category;
  label: string;
  body: string;
  enabled: boolean;
  locked: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="border-2 border-ink p-4 flex items-start gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={locked}
        onClick={() => onToggle(!enabled)}
        className={`shrink-0 mt-1 relative w-12 h-7 border-2 border-ink transition-colors ${
          enabled ? "bg-gold" : "bg-paper"
        } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-[2px] w-4 h-4 bg-ink transition-transform ${
            enabled ? "translate-x-[20px]" : "translate-x-[2px]"
          }`}
        />
      </button>
      <div className="flex-1 min-w-0">
        <p
          className="font-display uppercase tracking-wide text-ink text-sm"
          style={{ fontWeight: 800 }}
        >
          {label}
          {locked && (
            <span className="ml-2 font-mono text-[10px] text-ink/60 normal-case">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              — vedno aktivno / always on
            </span>
          )}
        </p>
        <p className="text-sm text-graphite mt-1">{body}</p>
      </div>
    </div>
  );
}

function pushToGoogle(state: ConsentState) {
  if (typeof window === "undefined") return;
  const payload = consentToGoogle(state);
  // gtag may not exist yet (no GA/GTM installed). If it doesn't, queue to
  // dataLayer so a tag that arrives later still picks it up.
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", payload);
  } else {
    const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    if (Array.isArray(dl)) {
      dl.push({ event: "consent_update", ...payload });
    }
  }
}
