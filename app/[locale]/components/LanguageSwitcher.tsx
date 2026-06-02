"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/request";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  // Strip leading /<locale> from the path so we can re-prefix it.
  const rest = pathname.replace(/^\/(sl|en)(?=\/|$)/, "") || "/";

  return (
    <div className="flex items-center gap-1 font-display uppercase text-xs tracking-widest">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${rest === "/" ? "" : rest}`}
          className={
            loc === currentLocale
              ? "px-2 py-1 bg-ink text-white"
              : "px-2 py-1 text-ink/60 hover:text-ink"
          }
          aria-current={loc === currentLocale ? "page" : undefined}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
