/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← ADD THIS LINE
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

