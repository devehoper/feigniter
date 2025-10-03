// Import TextEncoder and TextDecoder from the util module
const { TextEncoder, TextDecoder } = require("util");

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
$.fn.after = jest.fn().mockReturnThis();
$.fn.before = jest.fn().mockReturnThis();
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
