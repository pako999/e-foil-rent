/**
 * Cookie-consent state model + Google Consent Mode v2 mapping.
 *
 * Categories follow the standard IAB / EU cookie-consent grouping:
 *   - necessary  (always true, can't be toggled — legal basis: legitimate interest)
 *   - functional (language, preferences)
 *   - analytics  (traffic measurement, anonymised metrics)
 *   - marketing  (advertising, retargeting, conversion tracking)
 *
 * Google Consent Mode v2 needs 7 signals; we derive them from the 4
 * categories above so site owners can integrate GA4 / Google Ads / Meta /
 * any other vendor without writing extra glue.
 */

export type ConsentCategory =
  | "necessary"
  | "functional"
  | "analytics"
  | "marketing";

export type ConsentState = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  /** Unix seconds when the choice was recorded. */
  timestamp: number;
  /** Policy version — bump to re-trigger the banner after a major change. */
  version: number;
};

export const CONSENT_COOKIE = "cookie_consent";
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year
export const CONSENT_POLICY_VERSION = 1;

export const DEFAULT_DENIED: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: 0,
  version: CONSENT_POLICY_VERSION,
};

export const ALL_GRANTED: ConsentState = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
  timestamp: 0,
  version: CONSENT_POLICY_VERSION,
};

/** Parse the cookie value into a typed ConsentState, or null. */
export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as Partial<ConsentState>;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== CONSENT_POLICY_VERSION) return null;
    return {
      necessary: true,
      functional: !!parsed.functional,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      timestamp: Number(parsed.timestamp) || 0,
      version: CONSENT_POLICY_VERSION,
    };
  } catch {
    return null;
  }
}

/** Serialise a consent state into a `document.cookie` string. */
export function serializeConsent(
  state: Omit<ConsentState, "timestamp" | "version">,
  opts: { secure?: boolean } = {},
): string {
  const value: ConsentState = {
    ...state,
    necessary: true,
    timestamp: Math.floor(Date.now() / 1000),
    version: CONSENT_POLICY_VERSION,
  };
  const cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; samesite=lax${
    opts.secure ? "; secure" : ""
  }`;
  return cookie;
}

/**
 * Map our 4-category model to the 7-signal Google Consent Mode v2 payload.
 * Anything not granted is explicitly "denied" — never undefined — so
 * advertisers receive a deterministic signal.
 */
export function consentToGoogle(state: ConsentState | null) {
  const safe = state ?? DEFAULT_DENIED;
  const v = (b: boolean) => (b ? "granted" : "denied");
  return {
    ad_storage: v(safe.marketing),
    ad_user_data: v(safe.marketing),
    ad_personalization: v(safe.marketing),
    analytics_storage: v(safe.analytics),
    functionality_storage: v(safe.functional),
    personalization_storage: v(safe.functional),
    // security_storage is always granted — required for spam/fraud detection.
    security_storage: "granted" as const,
  };
}
