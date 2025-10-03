/**
 * @jest-environment jsdom
 */

// We need to un-mock the HomeController because we are testing it directly.
// The auto-mocking in jest.config.js is for when other components import it.
jest.unmock('../app/controller/HomeController.js');

const HomeController = require('../app/controller/HomeController.js');
const Controller = require('../app/kernel/Controller.js');

describe('HomeController', () => {
    let homeController;

    beforeEach(() => {
        // Create a new instance before each test
        homeController = new HomeController();
    });

    it('should call loadView with the correct view path when index() is called', () => {
        // Spy on the `loadView` method of the base Controller's prototype.
        // We expect the HomeController's method to call the parent's method.
        const loadViewSpy = jest.spyOn(Controller.prototype, 'loadView').mockImplementation(() => Promise.resolve());

        // Call the method we want to test
        homeController.index();

        // Assert that `loadView` was called with the expected arguments
        expect(loadViewSpy).toHaveBeenCalledWith("app/view/home/content");
        expect(loadViewSpy).toHaveBeenCalledTimes(1);

        // Clean up the spy to avoid affecting other tests
        loadViewSpy.mockRestore();
    });
});
