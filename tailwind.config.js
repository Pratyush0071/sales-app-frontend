/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E8450A",
        navy: "#1E3A5F",
        "navy-dark": "#152d4a",
        "navy-light": "#2a4f7c",
      },
    },
  },
  plugins: [],
};
