import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a1428",
        ocean: {
          DEFAULT: "#0c2340",
          deep: "#081a30",
        },
        sky: {
          DEFAULT: "#0ea5e9",
          dark: "#0284c7",
          light: "#7dd3fc",
        },
        sun: {
          DEFAULT: "#fb923c",
          dark: "#ea7423",
          light: "#fed7aa",
        },
        foam: "#fffaf0",
        sand: "#fef3e2",
        teal: {
          DEFAULT: "#00e5d4",
          dark: "#00b8aa",
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
      boxShadow: {
        card: "0 8px 24px -8px rgba(12, 35, 64, 0.18)",
        cardHover: "0 16px 40px -12px rgba(12, 35, 64, 0.3)",
        sun: "0 8px 24px -8px rgba(251, 146, 60, 0.5)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
