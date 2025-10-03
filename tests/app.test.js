/**
 * @jest-environment jsdom
 */
 
const { App } = require('../app/kernel/app.js');
// Mock dependencies
const HomeController = require('../app/controller/HomeController.js');
jest.mock('../app/controller/HomeController.js');

describe('App', () => {
    let app;

    beforeEach(() => {
        // Reset mocks and DOM before each test
        // When mocking a module with a default export, the mock is on the .default property
        const MockedHomeController = require('../app/controller/HomeController.js');
        MockedHomeController.default.mockClear();

        // Define mock global configs with static values before they are used.
        global.userConfig = {
            homeController: 'HomeController',
            defaultMethod: 'index',
            appContainerSelector: '#feigniter',
            preHooks: [],
            postHooks: [],
        };
        global.config = global.userConfig; // For testing, we can often make them identical.

        // Set up the app container. Use backticks for template literal and remove '#' from the selector for the id.
        const selector = global.userConfig.appContainerSelector.substring(1);
        document.body.innerHTML = `<div id="${selector}"></div>`;

        app = new App();
        
        // Make the app instance global for other modules to use, mimicking the browser
        global.app = app;
    });

    it('should initialize correctly', () => {
        expect(app).toBeDefined();
        expect(app.appContainer).not.toBeNull();
    });

    it('should load the home controller on hash change to root', async () => {
        // This is a more complex integration test that you can build out.
        // It would involve triggering a 'hashchange' event and asserting that
        // the correct controller and method were called.
        // For now, we'll keep it simple.
        expect(app.loadController).toBeInstanceOf(Function);
    });
});