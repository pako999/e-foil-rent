/**
 * Editable site content. Keep marketing/config data here so non-engineers
 * can tweak copy + tiers without touching components.
 */

export const SITE = {
  name: "Surf-Store.com — E-Foil",
  operator: "Surf-Store.com",
  contactEmail: "info@surf-store.com",
  mainSite: "https://www.surf-store.com",
  shop: "https://www.surf-store.com/t/categories/e-foil/e-foil-sets",
  videoId: "Wj6xwO_FDqU",
  duotoneYouTube: "https://www.youtube.com/@duotone.wingfoiling",
  phone: "+386 71 604 980",
  phoneRaw: "+38671604980",
  company: {
    name: "Sport Group d.o.o.",
    address: "Osojnikova 4",
    postal: "2000 Maribor",
    country: "Slovenija",
    vatId: "SI72133449",
    countryCode: "SI",
  },
  social: {
    instagram: "https://www.instagram.com/surfstore_com",
  },
} as const;

export const LEGAL_PAGES = ["terms", "refund", "privacy", "cookies"] as const;
export type LegalSlug = (typeof LEGAL_PAGES)[number];

/**
 * Duotone product range — links to the relevant category on surf-store.com.
 * Swap the YouTube IDs once you pick which Duotone videos to feature.
 */
export const DUOTONE_PRODUCTS = [
  {
    key: "dlab",
    image: "/board-2.jpg",
    shopUrl: "https://www.surf-store.com/t/categories/e-foil/e-foil-sets",
  },
  {
    key: "al",
    image: "/board-1.webp",
    shopUrl: "https://www.surf-store.com/t/categories/e-foil/e-foil-sets",
  },
  {
    key: "cruise",
    image: "/board-3.jpg",
    shopUrl: "https://www.surf-store.com/t/categories/e-foil/e-foil-sets",
  },
] as const;

/**
 * Featured Duotone YouTube videos. Replace these IDs with actual videos
 * from https://www.youtube.com/@duotone.wingfoiling that you want to feature.
 * Until then the page falls back to a single hero video + channel link.
 */
export const DUOTONE_VIDEOS: readonly string[] = [
  // Examples — replace with real Duotone video IDs.
  "Wj6xwO_FDqU",
];

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

// Gallery images. Drop the 5 photos shared by the user into /public with
// the filenames below. Until then the components fall back to placeholder
// SVGs so the page still renders.
export const GALLERY_IMAGES = [
  { src: "/hero.jpg", alt: "Rider gliding above clear water near a tropical island" },
  { src: "/action-1.jpg", alt: "E-foil rider carving on a dark blue wave" },
  { src: "/board-2.jpg", alt: "Blue-shirt rider holding the throttle on a clean wave" },
  { src: "/board-1.webp", alt: "Two riders cruising over turquoise reef water" },
  { src: "/action-2.jpg", alt: "E-foiler in front of a breaking wave with cloud backdrop" },
  { src: "/board-3.jpg", alt: "Duotone foilboard detail" },
] as const;

export const TECH_FEATURES = ["range", "speed", "battery", "weight", "silent", "easy"] as const;

// Featured packages shown in the marketing grid. The "best" flag highlights
// one card with the sun-accent stripe.
export const PACKAGE_HIGHLIGHTS = {
  "30min": { icon: "⚡", best: false },
  day1: { icon: "🏄", best: false },
  weekend: { icon: "🔥", best: true },
  week1: { icon: "🏖️", best: false },
  week2: { icon: "🏝️", best: false },
} as const;

export const REVIEW_KEYS = ["r1", "r2", "r3"] as const;

/**
 * Two FAQ tracks: questions you'd ask before showing up at Green Lake
 * (school/intro context), and questions specific to taking a board home
 * via the rental program.
 */
export const FAQ_GROUPS = [
  {
    key: "school",
    items: ["age", "experience", "weather", "gear", "weight"] as const,
  },
  {
    key: "rental",
    items: [
      "pickup",
      "cities",
      "ownSpot",
      "deposit",
      "charging",
      "transport",
      "damage",
      "cancel",
    ] as const,
  },
] as const;
