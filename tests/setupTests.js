// Import TextEncoder and TextDecoder from the util module
const { TextEncoder, TextDecoder } = require("util");

// Polyfill global TextEncoder and TextDecoder for testing
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// --- Mocking Global Dependencies ---
// The complexity of the Controller requires mocking the global environment extensively.
const mockJQueryObject = {
    empty: jest.fn().mockReturnThis(),
    append: jest.fn().mockReturnThis(),
    html: jest.fn().mockReturnThis(),
    after: jest.fn().mockReturnThis(),
    before: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    trigger: jest.fn().mockReturnThis(),
    // Add other jQuery methods you use here as needed
};

// The main '$' function will return our mock jQuery object.
const $ = jest.fn(selector => mockJQueryObject);

$.get = jest.fn(); // Mocking jQuery AJAX
global.$ = $;

// --- Mocking Global App Classes ---
// These are loaded via <script> tags in index.html, so we make them global in tests.
const Controller = require('../app/kernel/Controller.js');
const Model = require('../app/kernel/Model.js');
const ActionRegistry = require('../app/kernel/actions/action_registry.js');
const Action = require('../app/kernel/actions/action.js');
const validator = require('../app/src/js/lib/validator.js');
const formValidator = require('../app/src/js/lib/form_validator.js');

// --- Mocking Global Configs ---
// Import mock configs and set them globally for all tests.
const { mockUserConfig, mockConfig } = require('./mocks/config.js');
global.config = mockConfig;
global.userConfig = mockUserConfig;

global.Controller = Controller;
global.Model = Model;
global.ActionRegistry = ActionRegistry;
global.Action = Action;
global.validator = validator;
global.formValidator = formValidator;

// --- Mocking Third-party Libraries ---
global.i18next = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
    changeLanguage: jest.fn().mockResolvedValue(),
    t: jest.fn(key => key), // Return the key itself for simple translation tests
};
global.i18nextHttpBackend = {};
// --- Mocking Browser APIs ---
const localStorageMock = (() => {
    let store = {};

    // This function will be used to reset the store before each test.
    const clear = () => {
        store = {};
    };

    // This function will be used to inspect the store in tests.
    const getStore = () => {
        return store;
    };

    return {
        getItem: jest.fn(key => {
            // Return the stringified version if it exists, otherwise null.
            return store[key] ? JSON.stringify(store[key]) : null;
        }),
        setItem: jest.fn((key, value) => {
            // Parse the value to store it as an object, mimicking real usage.
            store[key] = JSON.parse(value);
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(clear),
        __getStore: getStore, // Expose for test assertions
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// --- Mocking Global App Object ---
// A simple, global `app` mock for convenience in controller/model tests.
// It will be reset before each test.
const appMock = {
    models: {},
    data: {},
    // Mock logging methods to prevent errors and allow spying
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    // Add other app properties/methods as needed for your tests
};
global.app = appMock;

// Clear mocks before each test
beforeEach(() => {
    localStorageMock.clear();
    // Also clear the mock function call history before each test
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();

    // Reset the app mock's state
    appMock.models = {};
    appMock.data = {};
    appMock.log.mockClear();
    appMock.warn.mockClear();
    appMock.error.mockClear();
});
