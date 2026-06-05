/**
 * Google Consent Mode v2 bootstrap.
 *
 * Renders an inline script *before* anything else loads, so analytics
 * tags (GA4, Google Ads, Meta, etc.) that arrive later see a deterministic
 * default state. By GCM v2 contract this MUST be the first thing on the
 * page so vendor pixels can update against it.
 *
 * Default = denied for everything except security_storage. Functional
 * `wait_for_update` of 500 ms gives the banner a window to read the cookie
 * and push the user's choice via `gtag('consent', 'update', …)` before
 * any tag actually fires.
 */
export function ConsentInit() {
  const script = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = window.gtag || gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 500
    });
  `;
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
