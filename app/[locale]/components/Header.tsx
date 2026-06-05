"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/i18n/request";
import { SITE } from "@/lib/content";

type NavItem =
  | { kind: "anchor"; href: string; key: string }
  | { kind: "page"; href: string; key: string };

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const items: NavItem[] = [
    { kind: "anchor", href: `/${locale}#packages`, key: "packages" },
    { kind: "page", href: `/${locale}/efoil`, key: "efoil" },
    { kind: "page", href: `/${locale}/duotone`, key: "duotone" },
    { kind: "anchor", href: `/${locale}#how`, key: "how" },
    { kind: "anchor", href: `/${locale}#specs`, key: "specs" },
    { kind: "anchor", href: `/${locale}#gallery`, key: "gallery" },
    { kind: "anchor", href: `/${locale}#faq`, key: "faq" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
      {/* Thin top utility bar */}
      <div className="hidden md:block bg-ink text-paper border-b-2 border-ink">
        <div className="container-x flex items-center justify-between h-9 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-gold">📍 Green Lake, Kidričevo</span>
            <span className="text-paper/40">·</span>
            <a href={`mailto:${SITE.contactEmail}`} className="hover:text-gold">
              {SITE.contactEmail}
            </a>
          </div>
          <div className="text-paper/60">
            Maribor · Ljubljana · Celje — možen prevzem
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-x flex items-center justify-between h-16 sm:h-20 gap-3">
        <Link
          href={`/${locale}`}
          className="font-display uppercase tracking-tight text-lg sm:text-2xl md:text-3xl text-ink leading-none truncate"
          style={{ fontWeight: 900 }}
          onClick={() => setOpen(false)}
        >
          Surf-Store<span className="text-gold">.</span>E-Foil
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 font-display uppercase text-base tracking-wide text-ink" style={{ fontWeight: 800 }}>
          {items.map((it) =>
            it.kind === "page" ? (
              <Link
                key={it.key}
                href={it.href}
                className="relative hover:text-gold transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-gold hover:after:w-full after:transition-all"
              >
                {t(it.key)}
              </Link>
            ) : (
              <a
                key={it.key}
                href={it.href}
                className="relative hover:text-gold transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-gold hover:after:w-full after:transition-all"
              >
                {t(it.key)}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`/${locale}#book`}
            className="hidden md:inline-flex btn-primary px-5 py-2.5 text-base"
          >
            {t("book")} →
          </a>
          <LanguageSwitcher currentLocale={locale} />
          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-11 h-11 border-2 border-ink bg-paper flex items-center justify-center text-ink"
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-6 h-6">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t-2 border-ink bg-paper">
          <nav className="container-x py-4 flex flex-col font-display uppercase text-lg tracking-wide text-ink divide-y-2 divide-ink/10" style={{ fontWeight: 800 }}>
            {items.map((it) =>
              it.kind === "page" ? (
                <Link
                  key={it.key}
                  href={it.href}
                  className="py-3 hover:text-gold"
                  onClick={() => setOpen(false)}
                >
                  {t(it.key)}
                </Link>
              ) : (
                <a
                  key={it.key}
                  href={it.href}
                  className="py-3 hover:text-gold"
                  onClick={() => setOpen(false)}
                >
                  {t(it.key)}
                </a>
              ),
            )}
            <a
              href={`/${locale}#book`}
              className="btn-primary w-full mt-4 text-base"
              onClick={() => setOpen(false)}
            >
              {t("book")} →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
