import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7E59FF",
          dark: "#444791",
          light: "#EDE7FF",
          hover: "#6E4AEF",   // for hover/active states
        },
        ink: {
          DEFAULT: "#333333",
          soft: "#555555",
          muted: "#666666",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F9FC",
          muted: "#F3F4F6",
        },
        neutral: {
          100: "#F7F9FC",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
        },
        border: {
          DEFAULT: "#E0E0E0",
        },
        accent: {
          DEFAULT: "#10B981",
          success: "#10B981",
          error: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(11, 18, 32, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
