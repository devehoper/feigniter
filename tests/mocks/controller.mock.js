/**
 * Generic mock for all controllers.
 * Jest will use this file to automatically mock any file inside `app/controller/`.
 *
 * It mocks a class with a default export that is a Jest mock function,
 * which is the structure your tests expect.
 */
module.exports = {
    default: jest.fn().mockImplementation(() => ({}))
};