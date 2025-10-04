// Import TextEncoder and TextDecoder from the util module
const { TextEncoder, TextDecoder } = require("util");
// Import the image snapshot matcher
const { toMatchImageSnapshot } = require('jest-image-snapshot');


// Polyfill global TextEncoder and TextDecoder for testing
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// --- Mocking Global Dependencies ---
// The complexity of the Controller requires mocking the global environment extensively.
const $ = jest.fn();
$.fn = jest.fn();
$.fn.empty = jest.fn().mockReturnThis();
$.fn.append = jest.fn().mockReturnThis();
$.fn.html = jest.fn().mockReturnThis();
$.fn.after = jest.fn().mockReturnThis(); // Ensures chaining like $(...).after(...).something() works
$.fn.before = jest.fn().mockReturnThis(); // Ensures chaining like $(...).before(...).something() works
$.get = jest.fn(); // Mocking jQuery AJAX
global.$ = $;

// Extend Jest's expect with the image snapshot matcher
expect.extend({ toMatchImageSnapshot });

// --- Import Mock Data ---
const { config, userConfig } = require('./mocks/data/config.mock.js');

// --- Mocking Global Application Objects ---
// These objects are expected to be in the global scope by your application scripts.
// Setting them up here ensures they are available for all test files.
global.config = config;
global.userConfig = userConfig;

// Mock the core classes that are used as globals by other scripts.
// This must be done BEFORE app.js is required, as it depends on them.
global.ActionRegistry = class { registerAction() {} };
global.Controller = require('../app/kernel/Controller.js');
global.Model = require('../app/kernel/Model.js').Model;

// --- Mocking Browser APIs ---
// Mock localStorage to ensure tests are isolated and don't interact
// with the actual browser storage.
const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
        delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();
global.localStorage = localStorageMock;

// Now that all dependencies are mocked and globally available, we can require the App class.
global.App = require('../app/kernel/app.js');

// --- Mute Console Methods ---
// Spy on console methods to prevent potential recursive loops from app.js logging
// and to allow for assertions in tests without polluting the output.
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
