import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import pluginStylistic from "@stylistic/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

const rules = {
  "prettier/prettier": [
    "error",
    {
      endOfLine: "auto",
    },
  ],
  "no-unused-vars": "warn",
  "array-bracket-newline": ["error", { multiline: true, minItems: 3 }],
  "array-bracket-spacing": ["error", "never"],
  "array-element-newline": ["error", { multiline: true, minItems: 3 }],
  "arrow-parens": ["error", "always"],
  "arrow-spacing": ["error", { before: true, after: true }],
  "block-spacing": ["error", "always"],
  "brace-style": ["error", "1tbs"],
  "comma-dangle": ["error", "always-multiline"],
  "comma-spacing": ["error", { before: false, after: true }],
  "comma-style": ["error", "last"],
  "computed-property-spacing": ["error", "never"],
  "dot-location": ["error", "property"],
  "eol-last": ["error", "always"],
  "func-call-spacing": ["error", "never"],
  "function-call-argument-newline": ["error", "consistent"],
  "function-paren-newline": ["error", "consistent"],
  "generator-star-spacing": ["error", { before: true, after: true }],
  "implicit-arrow-linebreak": ["error", "beside"],
  indent: ["error", 2, { SwitchCase: 1 }],
  "jsx-quotes": ["error", "prefer-double"],
  "key-spacing": ["error", { beforeColon: false, afterColon: true }],
  "keyword-spacing": ["error", { before: true, after: true }],
  "linebreak-style": ["error", "unix"],
  "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
  "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
  "no-trailing-spaces": ["error"],
  "object-curly-spacing": ["error", "always"],
  "quote-props": ["error", "as-needed"],
  quotes: ["error", "single", { avoidEscape: true }],
  semi: ["error", "always"],
  "space-before-blocks": ["error", "always"],
  "space-before-function-paren": ["error", "never"],
  "space-in-parens": ["error", "never"],
  "space-infix-ops": ["error"],
  "spaced-comment": ["error", "always", { exceptions: ["-"] }],
};

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      react: pluginReact,
      prettier: pluginPrettier,
      stylistic: pluginStylistic,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: rules,
  },
  pluginJs.configs.recommended,
  ...compat.config(pluginReact.configs.recommended),
  configPrettier,
];
