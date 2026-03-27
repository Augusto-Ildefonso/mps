/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    colors: {
      "orange": "#fe8707",
      "blue": "#0b4f98",
      "deep-blue": "#15315e",
      "light-blue": "#265cb4",
      "red": "#ea4523",
      "gray": "#9fa4b8",
      "white": "#edebeb",
    },
    extend: {
      fontFamily: {
        sans: ['sans-serif']
      }
    },
  },
  plugins: [],
}

