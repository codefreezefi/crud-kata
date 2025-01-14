import {baseRules} from "./base-config.mjs";
import eslintConfigPrettier from 'eslint-config-prettier';

const prettierOverwrites = {
    semi: false,
    singleQuote: true,
    printWidth: 120,
    trailingComma: 'all',
    arrowParens: 'avoid',
};

export const baseRulesWithPrettierOverrides = {
    ...baseRules,
    prettier: {
        ...eslintConfigPrettier.rules,
        'prettier/prettier': ['error', prettierOverwrites],
    },
};
