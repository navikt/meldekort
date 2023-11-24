/* eslint-env node */
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    plugins: ["react", "react-hooks", "@typescript-eslint"],
    rules: {
        // Define your custom ESLint rules here, if needed.
        /*
        "prettier/prettier": [
            "error",
            {
                "endOfLine": "auto",
                "singleQuote": true,
                "trailingComma": "none",
                "printWidth": 120
            }
        ]
        */
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    root: true
};
