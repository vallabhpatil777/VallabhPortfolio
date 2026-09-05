/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Small phones (iPhone SE / Galaxy S-series) need a step below Tailwind's 640px `sm`.
        xs: '475px',
        '3xl': '1720px',
      },
      fontFamily: {
        sans: [
          'Poppins',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        ink: '#090917',
        // One step lighter than `ink`, for banding sections against the backdrop.
        'ink-soft': '#0d0d20',
        surface: 'rgba(17,25,40,0.83)',
        'surface-2': 'rgba(23,32,52,0.72)',
        hairline: 'rgba(255,255,255,0.125)',
        brand: {
          DEFAULT: '#854CE6',
          300: '#c4a8f8',
          400: '#9d6ef0',
          500: '#854CE6',
          600: '#8C2EDB',
          700: '#6F10BF',
        },
        // Secondary hue for gradients and the aurora — keeps the palette from
        // reading as a single flat purple.
        accent: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#22d3ee',
          600: '#0ea5e9',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(23,92,230,0.15)',
        'card-hover': '0 18px 48px -12px rgba(133,76,230,0.45)',
        glow: '0 0 0 1px rgba(133,76,230,0.35), 0 0 34px -6px rgba(133,76,230,0.55)',
        'glow-sm': '0 0 22px -6px rgba(133,76,230,0.65)',
      },
      maxWidth: {
        content: '1200px',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '64px 64px',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        /* Aurora blobs. Three variants so the blobs never move in lockstep. */
        'drift-a': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%, 8%, 0) scale(1.12)' },
          '66%': { transform: 'translate3d(-5%, 4%, 0) scale(0.94)' },
        },
        'drift-b': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '40%': { transform: 'translate3d(-8%, -6%, 0) scale(0.92)' },
          '75%': { transform: 'translate3d(4%, -9%, 0) scale(1.15)' },
        },
        'drift-c': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(0.95)' },
          '50%': { transform: 'translate3d(7%, -7%, 0) scale(1.18)' },
        },
        /* Slow hue sweep for gradient text and borders. */
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        /* Expanding ring behind the "available" dot and the avatar pedestal. */
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '70%': { transform: 'scale(1.9)', opacity: '0' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        /* Skeleton sheen used by the avatar loading stage. */
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'scroll-hint': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '25%': { opacity: '1' },
          '75%': { opacity: '1' },
          '100%': { transform: 'translateY(12px)', opacity: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        'drift-a': 'drift-a 26s ease-in-out infinite',
        'drift-b': 'drift-b 32s ease-in-out infinite',
        'drift-c': 'drift-c 38s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'scroll-hint': 'scroll-hint 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
      transitionTimingFunction: {
        // A gentle overshoot for hover lifts — reads as "springy" without a
        // physics library.
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
