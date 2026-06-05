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

  const wrapClass = dark
    ? "border-paper"
    : "border-ink";

  const activeClass = dark
    ? "bg-paper text-ink"
    : "bg-ink text-paper";

  const inactiveClass = dark
    ? "text-paper hover:bg-gold hover:text-ink"
    : "text-ink hover:bg-gold";

  return (
    <div
      className={`flex items-center font-display uppercase text-xs tracking-widest border-2 ${wrapClass}`}
      style={{ fontWeight: 800 }}
    >
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${rest === "/" ? "" : rest}`}
          className={`px-3 py-1.5 ${loc === currentLocale ? activeClass : inactiveClass}`}
          aria-current={loc === currentLocale ? "page" : undefined}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
