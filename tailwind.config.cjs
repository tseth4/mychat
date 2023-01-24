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
        // 'orange': '#f77615',
        'orange': '#ee726a',
        'lightGray': '#969fad',
        'paleBlue': '#f0f3fd',
        'paleBlueGreen': '#e8f8f9',
        'darkBlueGreen': '#073a4a'
      }
    }

  },
  plugins: [require('@tailwindcss/typography')],
};
