import type { Config } from "tailwindcss";

// Brand tokens sourced from MA Logistics Brand Identity System v1.1 (Burgundy, 2026)
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "cargo-maroon": "#3C0008",
        "deck-maroon": "#5A0010",
        "signal-amber": "#E8A33D",
        steel: "#4A2A2E",
        fog: "#D8C9CC",
        paper: "#F4F1EC",
        "status-clear": "#3F7A5A",
        "status-hold": "#D94A2A",
      },
      fontFamily: {
        display: ["Inter Tight", "Arial", "sans-serif"],
        body: ["Inter", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.025em",
      },
    },
  },
  plugins: [],
};

export default config;
