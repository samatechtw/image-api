module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  slowTestThreshold: 60,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // transform everything.
  ],
}
