import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Skolverkets NP-häften går i magenta/vinrött
        np: {
          DEFAULT: "#b5004e",
          dark: "#8f003e",
          light: "#fdeef5",
          red: "#d2232a",
          redlight: "#fdeceb",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        page: "0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
