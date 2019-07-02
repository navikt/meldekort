module.exports = {
  parser: 'typescript',
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'es5',
  tabWidth: 2,
  overrides: [
    {
      files: '*.less',
      options: {
        singleQuote: false,
        parser: 'less',
      },
    },
  ],
};
