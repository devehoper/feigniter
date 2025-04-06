// Import TextEncoder and TextDecoder from the util module
const { TextEncoder, TextDecoder } = require("util");

// Polyfill global TextEncoder and TextDecoder for testing
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
