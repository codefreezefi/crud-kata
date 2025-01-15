module.exports = function() {
    return {
        files: [
            { pattern: '**/src/**/*.ts'},
            { pattern: '**/test/**/*-helpers.ts' },
            { pattern: '**/test/test-server.ts' },
        ],
        tests: [
            {pattern: '/**/test/**/*.spec.ts' },
            {pattern: '/**/_test/**/*.spec.ts' },
            {pattern: 'test/acceptance/*.spec.ts', ignore: true},
            // {pattern: '/**/test/**/*.test.ts' },
            // {pattern: '/**/test/**/*.ts' }
        ],
        testFramework: 'mocha',
        env: { type: 'node' },
    }
}
