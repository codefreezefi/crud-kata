import tslint from 'typescript-eslint';

import {baseEsLintConfig, baseRules} from "./base-config.mjs";
import customRules from "../rules/rules.mjs";

export const rules = {
    ...baseRules,
    custom: {
        ...baseRules.custom,
        ts: customRules.ts,
    },
    ts: {
        recommended: tslint.configs.recommended.rules,
        all: tslint.configs.all.rules,
    },
    recommended: {
        ...tslint.configs.recommended.rules,
        ...baseRules.recommended,
        ...customRules.js,
        ...customRules.ts,
    }
}

export const eslintConfig = {
    ...baseEsLintConfig,
    languageOptions: {
        ...baseEsLintConfig.languageOptions,
        parser: tslint.parser,
        parserOptions: {
            sourceType: 'module',
            project: './tsconfig.json',
            ecmaFeatures: {modules: true},
            ecmaVersion: 'latest',
        },
    },
    rules: {
        ...rules.recommended,
    },
    plugins: {
        ...baseEsLintConfig.plugins,
        'typescript-eslint': tslint.plugin,
    },
}