/**
 * Per-locale URL slugs for routes whose visible path differs by language.
 *
 * Files live at one canonical location (e.g. `app/[locale]/tecaji/page.tsx`),
 * but the user-visible URL is localised: `/sl/tecaji`, `/en/courses`,
 * `/de/kurse`. Public traffic uses these localised paths; the canonical
 * file is reached either directly (SL) or through next.config rewrites
 * (EN/DE).
 *
 * The redirects in `next.config.ts` flip the canonicalisation: visiting
 * `/en/tecaji` 308-redirects to `/en/courses`, so Google indexes only
 * the localised URL and credit accumulates on one canonical per locale.
 */

import type { LocaleKey } from "@/lib/blog-posts";

export const COURSES_SLUG = {
  sl: "tecaji",
  en: "courses",
  de: "kurse",
} as const satisfies Record<LocaleKey, string>;

export function coursesPath(locale: LocaleKey): string {
  return `/${locale}/${COURSES_SLUG[locale]}`;
}
