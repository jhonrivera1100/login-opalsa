/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        sidebar:{
          100:"#487ED6",
          300:"#676C82",
          900:"#0E2345",
      }
    },
  },
  plugins: [],
}
  }

