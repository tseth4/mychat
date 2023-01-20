/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    // fontFamily: {
    //   sans: ['Josefin Sans', 'sans-serif']
    // },
    typography: (theme) => ({}),
    colors: {
      white: "#FFFFFF"
    },
    extend: {
      colors: {
        'blackGradient': '#202730',
        'darkBlue': '#272e38',
        'mediumGray': '#7c8798',
        'pureWhite': '#FFF',
        'orange': '#f77615',
        'lightGray': '#969fad'
      }
    }

  },
  plugins: [require('@tailwindcss/typography')],
};
