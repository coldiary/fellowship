module.exports = {
  webpack: {
    configure: {
      resolve: {
        symlinks: false
      },
    }
  },
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
};
