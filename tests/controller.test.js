/**
 * @jest-environment jsdom
 */
 
const Controller = require('../app/kernel/Controller.js');

describe('Base Controller', () => {
    it('should be able to be instantiated', () => {
        const controller = new Controller();
        expect(controller).toBeInstanceOf(Controller);
    });
});