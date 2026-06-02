/**
 * Editable site content. Keep marketing/config data here so non-engineers
 * can tweak copy + tiers without touching components.
 */

export const SITE = {
  name: "Surf-Store.com — E-Foil",
  operator: "Surf-Store.com",
  contactEmail: "info@surf-store.com",
  mainSite: "https://www.surf-store.com",
  social: {
    instagram: "https://www.instagram.com/surfstoreslovenia",
    facebook: "https://www.facebook.com/surfstoreslovenia",
  },
} as const;

export const LOCATION = {
  name: "Green Lake, Kidričevo",
  address: "Green Lake, Kidričevo, Slovenija",
  // Approx coords for Green Lake (Zeleno jezero), Kidričevo.
  lat: 46.4039,
  lng: 15.7919,
  mapsQuery: "Green+Lake+Kidricevo",
} as const;

export const FEATURE_KEYS = ["electric", "silent", "easy"] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];

export const HOW_STEPS = [1, 2, 3] as const;
