/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A90E2",
          light: "#7BB8F5",
          dark: "#357ABD",
        },
        secondary: "#50E3C2",
        neutral: {
          100: "#F5F7FA",
          200: "#E4E7EB",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        modalFadeIn: "modalFadeIn 0.3s ease-out forwards",
      },
      keyframes: {
        modalFadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
