"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/request";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(sl|en)(?=\/|$)/, "") || "/";

  return (
    <div className="flex items-center gap-1 font-display uppercase text-xs tracking-widest rounded-full bg-white p-1 border border-ocean/10 shadow-card">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${rest === "/" ? "" : rest}`}
          className={
            loc === currentLocale
              ? "px-3 py-1 rounded-full bg-ocean text-white"
              : "px-3 py-1 rounded-full text-ocean/50 hover:text-ocean"
          }
          aria-current={loc === currentLocale ? "page" : undefined}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
