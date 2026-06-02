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

// Gallery images — drop real photos into /public and reference here.
export const GALLERY_IMAGES = [
  { src: "/board-1.svg", alt: "Rider flying above Green Lake at sunset" },
  { src: "/board-2.svg", alt: "Carving turns on the e-foil" },
  { src: "/board-3.svg", alt: "Beginner taking off for the first time" },
  { src: "/hero-placeholder.svg", alt: "Wide view of Green Lake, Kidričevo" },
  { src: "/board-1.svg", alt: "Group lesson on the lake shore" },
  { src: "/board-2.svg", alt: "Duotone e-foil board detail" },
] as const;

// Featured packages shown in the marketing grid. The "best" flag highlights
// one card with the sun-accent stripe.
export const PACKAGE_HIGHLIGHTS = {
  "30min": { icon: "⚡", best: false },
  day1: { icon: "🏄", best: false },
  day2: { icon: "🌊", best: false },
  day3: { icon: "🔥", best: true },
  week1: { icon: "🏖️", best: false },
  week2: { icon: "🏝️", best: false },
} as const;

export const REVIEW_KEYS = ["r1", "r2", "r3"] as const;
export const FAQ_KEYS = ["age", "experience", "weather", "gear", "weight", "cancel"] as const;
