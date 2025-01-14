import {eslintConfig, rules} from '@crud-kata/eslint-base/js';

export default [
  {
    ...eslintConfig
  },
  {
    plugins: eslintConfig.plugins,
    rules: rules.recommended
  }
]
