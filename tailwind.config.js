/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("@tailwindcss/typography"),
    // eslint-disable-next-line no-undef
    require("daisyui")
  ],
  daisyui: {
    darkTheme: "dracula",
    themes: ["dracula", "light"],
  },
}