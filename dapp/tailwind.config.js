module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        'trade': '1fr 48px 1fr'
      },
      screens: {
        'xs': '380px',
      },
      maxHeight: {
        '9/10': '90%'
      },
      colors: {
        main: {
          lighter: '#9091b6',
          DEFAULT: '#585a88',
          darker: '#30314a'
        },
        whitee: '#ffffff',
        darkee: '#333333',
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
