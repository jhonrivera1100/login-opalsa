/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        104: "26rem",
        112: "28rem",
        120: "30rem",
        128: "32rem",
        144: "36rem",
      },
      colors: {
        sidebar: {
          100: "#487ED6",
          300: "#676C82",
          900: "#0E2345",
        },
      },
    },
  },
  plugins: [],
};
