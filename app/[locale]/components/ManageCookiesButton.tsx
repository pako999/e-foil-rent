"use client";

/**
 * Footer link that re-opens the cookie consent banner. The banner mounts
 * once per session and installs `window.openCookieSettings` so this
 * button can call into it from anywhere.
 */
export function ManageCookiesButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="text-paper/80 hover:text-gold text-left"
      onClick={() =>
        typeof window !== "undefined" && window.openCookieSettings?.()
      }
    >
      {label}
    </button>
  );
}
