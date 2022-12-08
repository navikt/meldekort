module.exports = function override(config) {
  config = {
    ...config,
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };

  return config;
};
