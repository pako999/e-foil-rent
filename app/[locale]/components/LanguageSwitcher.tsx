"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/request";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(sl|en)(?=\/|$)/, "") || "/";

  return (
    <div className="flex items-center font-display uppercase text-xs tracking-widest border-2 border-ink" style={{ fontWeight: 800 }}>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${rest === "/" ? "" : rest}`}
          className={
            loc === currentLocale
              ? "px-3 py-1.5 bg-ink text-paper"
              : "px-3 py-1.5 text-ink hover:bg-gold"
          }
          aria-current={loc === currentLocale ? "page" : undefined}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
