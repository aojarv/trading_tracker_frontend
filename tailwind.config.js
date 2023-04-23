/** @type {import('tailwindcss').Config} */
export default {
  plugins: [],
    theme: {
    extend: {
      colors: {
        'light-shades': '#EEF2F3',
        'light-accent': '#979089',
        'main-brand-color': '#F72614',
        'dark-accent': '#929191',
        'dark-shades': '#1F2228',
      }
    },
  },
  purge: ["./index.html",'./src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  darkMode: false, // or 'media' or 'class'
}
