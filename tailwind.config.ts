import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
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
          hover: "#6E4AEF",
          // Dark mode variants
          'dark-mode': "#8B6FFF",
          'dark-hover': "#9D7FFF",
        },
        ink: {
          DEFAULT: "#333333",
          soft: "#555555",
          muted: "#666666",
          // Dark mode variants
          'dark': "#E0E0E0",
          'dark-soft': "#B0B0B0",
          'dark-muted': "#888888",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F9FC",
          muted: "#F3F4F6",
          // Dark mode variants
          'dark': "#1E1E1E",
          'dark-alt': "#252525",
          'dark-muted': "#2A2A2A",
        },
        neutral: {
          100: "#F7F9FC",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          // Dark mode variants
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        border: {
          DEFAULT: "#E0E0E0",
          'dark': "#3A3A3A",
          'dark-soft': "#2A2A2A",
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
