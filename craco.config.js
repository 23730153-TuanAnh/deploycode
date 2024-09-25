/* craco.config.js */
const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@scss': path.resolve(__dirname, 'src/scss/index.scss'),
      '@api': path.resolve(__dirname, 'src/services/api'),
      '@actions': path.resolve(__dirname, 'src/stores/slices'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@lazy': path.resolve(__dirname, 'src/lazy_loadings')
    }
  },
};