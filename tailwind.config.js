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
      "dark-blue": "#122f63",
      "deep-blue": "#15315e",
      "light-blue": "#265cb4",
      "red": "#ea4523",
      "gray": "#9fa4b8",
      "light-gray": "#f2f6f7",
      "dark-gray": "#636564",
      "white": "#edebeb",
      "full-white": "#ffffff"
    },
    extend: {
      fontFamily: {
        sans: ['sans-serif']
      }
    },
  },
  plugins: [],
}

