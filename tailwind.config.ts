import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      colors: {
        primary: {
          "100": "#ECF7F0", // Lighter, muted green
          DEFAULT: "#407B53", // Deeper, natural green
        },
        secondary: "#F1C86F", // Soft, golden highlight
        black: {
          "100": "#2E2E2E",  // Slightly softened black
          "200": "#1B1B1B",
          "300": "#737373",  // Gray for subtitles or secondary text
          DEFAULT: "#000000",
        },
        white: {
          "100": "#F7F7F7",  // Off-white for backgrounds
          DEFAULT: "#FFFFFF",
        },
      },
      fontFamily: {
        "work-sans": ["var(--font-work-sans)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        100: "2px 2px 0px 0px rgb(0, 0, 0)",
        200: "2px 2px 0px 2px rgb(0, 0, 0)",
        300: "2px 2px 0px 2px #407B53", // Match primary color for a thematic accent
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
