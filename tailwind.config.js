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
        surface: 'rgba(17,25,40,0.83)',
        hairline: 'rgba(255,255,255,0.125)',
        brand: {
          DEFAULT: '#854CE6',
          400: '#9d6ef0',
          500: '#854CE6',
          600: '#8C2EDB',
          700: '#6F10BF',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(23,92,230,0.15)',
        'card-hover': '0 10px 34px rgba(133,76,230,0.28)',
      },
      maxWidth: {
        content: '1200px',
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
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
