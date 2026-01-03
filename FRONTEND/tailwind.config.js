/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ["'Fredoka One'", "cursive"],
        poppins: ["Poppins"],
        inter: ["Inter"],
        dmsans: ["DM Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
