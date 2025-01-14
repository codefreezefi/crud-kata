import {eslintConfig, rules} from '@crud-kata/eslint-base/ts';

export default [
  eslintConfig,
  {
    languageOptions: {
      parserOptions: {
        ...eslintConfig.languageOptions.parserOptions,
        project: './tsconfig.test.json',
      },
    },
  },
  {
    // Add here any rules you want to turn off!
    rules: {
      "@stylistic/comma-dangle": "off",
      "@stylistic/quotes": "off"
    },
  },
];
