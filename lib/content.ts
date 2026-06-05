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
  social: {
    instagram: "https://www.instagram.com/surfstoreslovenia",
    facebook: "https://www.facebook.com/surfstoreslovenia",
  },
} as const;

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
export const FAQ_KEYS = ["age", "experience", "weather", "gear", "weight", "cancel"] as const;
