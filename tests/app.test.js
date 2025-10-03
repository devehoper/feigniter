/**
 * @jest-environment jsdom
 */

// Unmock the App class since it's the system under test.
jest.unmock('../app/kernel/app.js');
const { App } = require('../app/kernel/app.js');

// Mock dependencies
// These are automatically mocked by jest.config.js, but we need to
// require them to spy on their methods.
const MockedHomeController = require('../app/controller/HomeController.js');
// const MockedUserController = require('../app/controller/UserController.js');

describe('App Integration', () => {
    let app;
    let loadControllerSpy;

    beforeEach(() => {
        // Reset mocks and DOM before each test
        MockedHomeController.default.mockClear();
        // Also clear the mock for the new UserController
        // if (MockedUserController && MockedUserController.default) {
        //     MockedUserController.default.mockClear();
        // }

        // Set up the app container.
        const selector = (global.userConfig.appContainerSelector ?? global.config.appContainerSelector).substring(1);
        document.body.innerHTML = `<div id="${selector}"></div>`;

        app = new App();
        
        // Make the app instance global for other modules to use, mimicking the browser
        global.app = app;

        // Spy on loadController to see if it's called correctly by the router.
        // This is the core of our integration test.
        loadControllerSpy = jest.spyOn(app, 'loadController').mockImplementation(() => Promise.resolve());
    });

    afterEach(() => {
        // Restore all mocks
        loadControllerSpy.mockRestore();
    });

    it('should initialize correctly', () => {
        expect(app).toBeDefined();
        expect(app.appContainer).not.toBeNull();
    });

    it('should route to the HomeController on hash change to root', async () => {
        // Simulate the hash changing to the root
        window.location.hash = '#';
        await app.handleHashChange();

        // Assert that loadController was called with the default controller and method
        expect(loadControllerSpy).toHaveBeenCalledWith('HomeController', 'index', []);
    });

    // it('should route to the UserController and call the profile method with an ID', async () => {
    //     // Simulate the hash changing to a user profile URL
    //     window.location.hash = '#/UserController?profile=123';
    //     await app.handleHashChange();

    //     // Assert that the router calls loadController with the correct parameters
    //     expect(loadControllerSpy).toHaveBeenCalledWith('UserController', 'profile', ['123']);
    // });
});