import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        panel: "#F5F7FA",
        primary: {
          DEFAULT: "#1E3A5F",
          light: "#2C5182",
          dark: "#152A45",
        },
        accent: {
          DEFAULT: "#2FA6A6",
          light: "#4FC2C2",
          dark: "#237F7F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Roboto", "system-ui", "sans-serif"],
        serif: ["var(--font-pt-serif)", "PT Serif", "Georgia", "serif"],
        "plex-sans": ["var(--font-ibm-plex-sans)", "IBM Plex Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(30, 58, 95, 0.08), 0 1px 2px rgba(30, 58, 95, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
