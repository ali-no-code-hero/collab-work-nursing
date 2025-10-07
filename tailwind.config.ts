import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CollabWORK-inspired palette (easily tweak these to match brand exactly)
        primary: {
          DEFAULT: "#2E6AFF", // bright blue for CTAs
          dark: "#1E3EA8",    // deep blue for hovers
          light: "#EAF2FF",   // pale blue background
        },
        ink: {
          DEFAULT: "#0B1220", // near-black for headings
          soft: "#3B4252",    // muted body text
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F9FC",     // light gray/blue surface
        },
        accent: {
          DEFAULT: "#10B981"  // green accent (success tags)
        }
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(11, 18, 32, 0.08)"
      }
    },
  },
  plugins: [],
};
export default config;
