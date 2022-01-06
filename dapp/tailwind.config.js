const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    nightwind: {
      transitionDuration: "500ms", // default '300ms'
      color: {
        white: '#111111',
        // primary: 'indigo'
      }
    },
    extend: {
      colors: {
        primary: colors.indigo[500],
        hint: colors.gray[500],
        dark: '#242424',
        darker: '#181818'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('nightwind')],
}
