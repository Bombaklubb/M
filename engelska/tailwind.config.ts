import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Dynamic stage classes used in stages.ts / world pages
    { pattern: /^(from|via|to|bg|border|text)-(ord|gram|text|acad)-\d+$/ },
    { pattern: /^bg-gradient-to-(br|bl|tr|tl|r|l|t|b)$/ },
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["Baloo 2", "Comic Neue", "system-ui", "sans-serif"],
      },
      borderWidth: {
        "3": "3px",
        "4": "4px",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      colors: {
        // Lågstadiet – Ordbyn (British red / rose)
        ord: {
          50:  "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        // Mellanstadiet – Grammatikskogen (bright British blue)
        gram: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Högstadiet – Texthavet (deep indigo)
        text: {
          50:  "#f0f4ff",
          100: "#e0e8ff",
          200: "#c7d7fe",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // Gymnasiet – Engelska Akademin (deep crimson)
        acad: {
          50:  "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        // English brand (Union Jack blue)
        en: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#1e3268",
        },
      },
      animation: {
        "bounce-slow":  "bounce 2s infinite",
        "pulse-slow":   "pulse 3s infinite",
        "fade-in":      "fadeIn 0.5s ease-in-out",
        "slide-up":     "slideUp 0.4s ease-out",
        "pop":          "pop 0.3s ease-out",
        "wiggle":       "wiggle 0.5s ease-in-out",
        "float":        "float 3s ease-in-out infinite",
        "squish":       "squish 0.2s ease-out",
        // MagicUI
        "border-beam":  "border-beam calc(var(--duration)*1s) infinite linear",
        "shimmer":      "shimmer 2s linear infinite",
        "gradient":     "gradient 8s linear infinite",
        "aurora":       "aurora 8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        pop:     { "0%": { transform: "scale(0.9)" }, "50%": { transform: "scale(1.05)" }, "100%": { transform: "scale(1)" } },
        wiggle:  { "0%, 100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
        float:   { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        squish:  { "0%": { transform: "scale(1, 1)" }, "50%": { transform: "scale(1.1, 0.9)" }, "100%": { transform: "scale(1, 1)" } },
      },
    },
  },
  plugins: [],
};

export default config;
