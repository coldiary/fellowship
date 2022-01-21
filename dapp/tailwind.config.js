module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        main: {
          lighter: '#9091b6',
          DEFAULT: '#585a88',
          darker: '#30314a'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
