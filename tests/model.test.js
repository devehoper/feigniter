/**
 * @jest-environment jsdom
 */
 
const Model = require('../app/kernel/Model.js');

describe('Base Model', () => {
    it('should be able to be instantiated', () => {
        const model = new Model();
        expect(model).toBeInstanceOf(Model);
    });
});