/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Chrome/UI: geometrisk, bestämd – medvetet INTE rundad (rundade
        // typsnitt som Baloo läser som "småbarn" och det är hela poängen
        // med den här appen att undvika).
        display: ['Outfit', 'system-ui', 'sans-serif'],
        // Bokstäver och ord som eleven ska LÄSA. Lexend är framtaget för
        // läsflyt och har entydiga a, g, I och l.
        reading: ['Lexend', 'system-ui', 'sans-serif'],
        // Sätts av inställningen "dyslexivänligt typsnitt".
        dyslexic: ['OpenDyslexic', 'Lexend', 'sans-serif'],
      },
      colors: {
        // Mättade, självsäkra accenter. Inga pastelltoner som primärfärg.
        brand: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95',
        },
        aqua: {
          100: '#cffafe', 300: '#67e8f9', 400: '#22d3ee',
          500: '#06b6d4', 600: '#0891b2', 700: '#0e7490',
        },
        lime: {
          100: '#ecfccb', 300: '#bef264', 400: '#a3e635',
          500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f',
        },
        amberx: {
          100: '#fef3c7', 300: '#fcd34d', 400: '#fbbf24',
          500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        },
        ink: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#0f172a', 950: '#020617',
        },
      },
      borderRadius: {
        // Kantigt-men-mjukt. Aldrig rounded-full på kort.
        tile: '1rem',
        card: '1.25rem',
      },
      boxShadow: {
        // "Arcade"-knapp: hård offset-skugga, trycks ned vid klick.
        pop: '0 4px 0 0 rgb(0 0 0 / 0.25)',
        'pop-sm': '0 2px 0 0 rgb(0 0 0 / 0.25)',
        tile: '0 3px 0 0 rgb(0 0 0 / 0.18)',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '60%': { transform: 'scale(1.06)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'flash-ok': {
          '0%': { opacity: '0' },
          '25%': { opacity: '0.85' },
          '100%': { opacity: '0' },
        },
        /* Berömmet: poppa in, STÅ KVAR, tona bort.
           Den långa platån i mitten är hela poängen – en elev som behöver
           tid ska hinna se vad som dök upp innan det börjar blekna. */
        'berom': {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '8%': { transform: 'scale(1.06)', opacity: '1' },
          '14%': { transform: 'scale(1)', opacity: '1' },
          '72%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.96)', opacity: '0' },
        },
        'nudge': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        'ear-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        // Lotsningsglöd: pulserar RINGEN, aldrig elementets storlek.
        // En knapp som ändrar storlek är en rörlig träffyta, och det är
        // precis fel för en elev med motoriska svårigheter.
        'guide-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(132 204 22 / 0.9)' },
          '50%': { boxShadow: '0 0 0 12px rgb(132 204 22 / 0)' },
        },
        'chest-shake': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-6deg)' },
          '40%': { transform: 'rotate(6deg)' },
          '60%': { transform: 'rotate(-4deg)' },
          '80%': { transform: 'rotate(4deg)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-48px)', opacity: '0' },
        },
      },
      animation: {
        'pop-in': 'pop-in 250ms ease-out',
        'flash-ok': 'flash-ok 700ms ease-out',
        /* Håll i synk med BEROM_MS i components/FeedbackOverlay.tsx. */
        'berom': 'berom 1800ms ease-out',
        'nudge': 'nudge 300ms ease-in-out',
        'ear-pulse': 'ear-pulse 900ms ease-in-out infinite',
        'guide-glow': 'guide-glow 1400ms ease-out infinite',
        'chest-shake': 'chest-shake 600ms ease-in-out',
        'float-up': 'float-up 900ms ease-out forwards',
      },
    },
  },
  plugins: [],
}
