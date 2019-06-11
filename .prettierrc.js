module.exports = {
    parser: 'typescript',
    singleQuote: true,
    printWidth: 120,
    trailingComma: 'es5',
    tabWidth: 4,
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
