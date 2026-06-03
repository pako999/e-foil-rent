import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        gold: {
          DEFAULT: "#FFD600",
          dark: "#E6C100",
          light: "#FFE54C",
        },
        teal: {
          DEFAULT: "#AADDDD",
          dark: "#7FC1C1",
          light: "#D6EEEE",
        },
        // Neutrals
        ink: "#1A1A1A",
        charcoal: "#1F1F1F",
        graphite: "#333333",
        mute: "#7B7B7B",
        rule: "#DEDEDE",
        // Surfaces
        paper: "#FFFFFF",
        cream: "#FAFAF7",
        // Aliases kept so we don't have to rewrite every classname
        ocean: { DEFAULT: "#1A1A1A", deep: "#000000" },
        sky: { DEFAULT: "#AADDDD", dark: "#7FC1C1", light: "#D6EEEE" },
        sun: { DEFAULT: "#FFD600", dark: "#E6C100", light: "#FFE54C" },
        foam: "#FFFFFF",
        sand: "#FAFAF7",
      },
      fontFamily: {
        display: ["var(--font-display)", "Sofia Sans Condensed", "Nunito Sans", "sans-serif"],
        sans: ["var(--font-sans)", "Nunito Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        card: "0 1px 0 0 #1A1A1A",
        cardHover: "0 4px 0 0 #1A1A1A",
        sharp: "4px 4px 0 0 #1A1A1A",
        gold: "0 0 0 2px #FFD600",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;
