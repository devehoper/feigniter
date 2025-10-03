module.exports = {
  testEnvironment: "jest-environment-jsdom", // Use JSDOM for simulating a browser environment
  roots: ["<rootDir>/tests"], // Directory containing test files
  moduleFileExtensions: ["js", "json"], // File extensions to consider
  // By removing the transform property, Jest will automatically use babel-jest
  moduleNameMapper: {
    // Automatically mock all controllers using our generic mock file.
    // The <rootDir> token is crucial here. It tells Jest to respect
    // jest.unmock() calls for modules that match this pattern.
    '^../app/controller/(.*)$':
      '<rootDir>/tests/mocks/controller.mock.js',
  },
  verbose: true, // Display detailed test results
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"], // Setup file for initializing tests
};
