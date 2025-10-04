describe('Controller', () => {
    let controllerInstance;
    let app;

    beforeAll(() => {
        // Mock the global fetch function
        global.fetch = jest.fn((url) =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve(`Content for ${url}`),
            })
        );
    });

    beforeEach(() => {
        // Create a fresh app instance for each test
        app = new App();
        global.app = app; // Make it globally available for the Controller
        controllerInstance = new Controller();
        // Spy on the real translate method of the app instance for this test.
        // This allows us to check if it was called without replacing its functionality.
        jest.spyOn(app, 'translate').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    // --- loadViewContent Tests ---

    describe('loadViewContent', () => {
        const defaultViewUrls = 'home';
        const defaultSelector = '#feigniter';
 
        test('should empty the target selector if overwrite is true (default)', async () => {
            await controllerInstance.loadViewContent({ viewUrls: defaultViewUrls });
            expect($(defaultSelector).empty).toHaveBeenCalled();
            expect($(defaultSelector).html).toHaveBeenCalledWith('Content for home.html');
            expect(app.translate).toHaveBeenCalled();
        });
 
        test('should fetch a new view using fetch()', async () => {
            await controllerInstance.loadViewContent({ viewUrls: 'new-view' });
 
            expect(global.fetch).toHaveBeenCalledWith('new-view.html');
            expect($(defaultSelector).html).toHaveBeenCalledWith('Content for new-view.html');
        });
 
        test('should handle view loading error gracefully', async () => {
            // Mock fetch to reject
            global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Network Error")));
 
            await controllerInstance.loadViewContent({ viewUrls: 'error-view' });
 
            expect(app.translate).toHaveBeenCalled(); // Should still call translate
            expect($(defaultSelector).html).toHaveBeenCalledWith(expect.stringContaining("Failed to load content: Network Error"));
        });
    });
});
