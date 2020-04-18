module.exports = {
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_ENV: 'test'
    },
    restoreMocks: true,
    coverageReporters: ['text', 'lcov', 'clover', 'html']
};
