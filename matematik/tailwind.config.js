/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Game theme colors
        gold: {
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
        },
        game: {
          bg: '#120318',
          bgMid: '#1e0828',
          bgDeep: '#2d0d1e',
          card: 'rgba(50,12,38,0.70)',
          border: 'rgba(200,130,50,0.28)',
          orange: '#f97316',
          orangeDark: '#c2560a',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'star-pop': 'starPop 0.6s ease-out',
        'confetti': 'confetti 0.8s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'legendaryPulse': 'legendaryPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        // Magic UI
        'meteor': 'meteor 5s linear infinite',
        'shimmer-slide': 'shimmer-slide 3s linear infinite',
        'gradient-shift': 'gradient-shift 3s linear infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
      },
      keyframes: {
        legendaryPulse: {
          '0%, 100%': { boxShadow: '0 4px 28px rgba(251,191,36,0.25)', borderColor: 'rgba(251,191,36,0.5)' },
          '50%': { boxShadow: '0 4px 36px rgba(251,191,36,0.55)', borderColor: 'rgba(251,191,36,0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        starPop: {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        // Magic UI keyframes
        meteor: {
          '0%': { transform: 'rotate(var(--angle, 215deg)) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'rotate(var(--angle, 215deg)) translateX(-500px)', opacity: '0' },
        },
        'shimmer-slide': {
          '0%': { transform: 'translateX(-100%) rotate(0deg)' },
          '100%': { transform: 'translateX(100%) rotate(0deg)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'border-beam': {
          '100%': { offsetDistance: '100%' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
