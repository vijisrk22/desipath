/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        pagebg: '#F8FAFC',
        card: '#FFFFFF',
        bordercol: '#E5E7EB',
        textprimary: '#0F172A',
        textsecondary: '#64748B',
      },
      fontFamily: {
        fredoka: ["'Fredoka One'", "cursive"],
        poppins: ["Poppins"],
        inter: ["Inter", "sans-serif"],
        dmsans: ["DM Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
