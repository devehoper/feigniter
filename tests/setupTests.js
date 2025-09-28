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
