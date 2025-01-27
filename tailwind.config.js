/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Includes all relevant files
  ],
  theme: {
    extend: {},
    fontFamily: {
      
      sans: ['Poppins', 'sans-serif'],
    },
    
  },
  plugins: [],
};
