"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/request";

export function LanguageSwitcher({
  currentLocale,
  variant = "light",
}: {
  currentLocale: Locale;
  /** "light" = header on white bg, "dark" = footer on ink bg. */
  variant?: "light" | "dark";
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(sl|en)(?=\/|$)/, "") || "/";
  const dark = variant === "dark";

  const activeClass = dark
    ? "text-gold"
    : "text-ink";

  const inactiveClass = dark
    ? "text-paper/40 hover:text-paper"
    : "text-ink/40 hover:text-ink";

  return (
    <div
      className="inline-flex items-center gap-3 font-display uppercase text-sm tracking-widest"
      style={{ fontWeight: 800 }}
    >
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-3">
          {i > 0 && (
            <span className={dark ? "text-paper/20" : "text-ink/20"} aria-hidden="true">
              /
            </span>
          )}
          <Link
            href={`/${loc}${rest === "/" ? "" : rest}`}
            className={loc === currentLocale ? activeClass : inactiveClass}
            aria-current={loc === currentLocale ? "page" : undefined}
          >
            {loc}
          </Link>
        </span>
      ))}
    </div>
  );
}
