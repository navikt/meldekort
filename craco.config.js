module.exports = function override(config) {
  config.optimization.splitChunks = {
    chunks: 'all',
  };

  return config;
};
