/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#0f766e",
          600: "#0b5f59",
          700: "#134e4a",
        },
        accent: "#f59e0b",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
