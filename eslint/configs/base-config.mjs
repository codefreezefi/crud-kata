import mochaPlugin from 'eslint-plugin-mocha';
import stylisticJs from '@stylistic/eslint-plugin';
import globals from 'globals';

import customRules from '../rules/rules.mjs';

export const baseRules = {
    mocha: {
        recommended: mochaPlugin.configs.recommended.rules,
        all: mochaPlugin.configs.all.rules,
    },
    custom: {
        js: customRules.js,
    },
    recommended: {
        ...mochaPlugin.configs.recommended.rules,
        ...customRules.js,
        ...customRules.mocha,
    }
};

export const baseEsLintConfig = {
    languageOptions: {
        sourceType: 'module',
        globals: {
            ...globals.browser,
            describe: 'readonly',
            it: 'readonly',
        },
    },
    settings: {
        'import/parsers': {
            espree: ['.js', '.cjs', '.mjs'],
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts', 'mjs'],
            },
        },
    },
    rules: {
        ...baseRules.recommended,
    },
    plugins: {
        '@stylistic': stylisticJs,
        mocha: mochaPlugin,
    },
    files: ['src/**/*.ts', 'test/**/*.ts'],
};
