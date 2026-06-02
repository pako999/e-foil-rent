import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0e1a",
        teal: {
          DEFAULT: "#00e5d4",
          dark: "#00b8aa",
        },
        surf: {
          blue: "#0066ff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Barlow Condensed", "sans-serif"],
        sans: ["var(--font-sans)", "Barlow", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
} satisfies Config;
