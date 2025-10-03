module.exports = {
  testEnvironment: "jest-environment-jsdom", // Use JSDOM for simulating a browser environment
  roots: ["<rootDir>/tests"], // Directory containing test files
  moduleFileExtensions: ["js", "json"], // File extensions to consider
  // By removing the transform property, Jest will automatically use babel-jest
  verbose: true, // Display detailed test results
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"], // Setup file for initializing tests
};
