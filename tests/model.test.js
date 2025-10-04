describe('Model', () => {
    // The global 'Model' is available from setupTests.js
    const storageKey = config.localStorage;

    beforeEach(() => {
        // The localStorage mock from setupTests.js is used automatically.
        // We clear it before each test to ensure isolation.
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('Local Storage Interaction', () => {
        test('getLocalData should return an empty object when storage is empty', () => {
            const data = Model.getLocalData();
            expect(data).toEqual({});
        });

        test('setLocalData should add new data to localStorage', () => {
            const newData = { theme: 'dark' };
            Model.setLocalData(newData);

            const storedRaw = localStorage.getItem(storageKey);
            expect(JSON.parse(storedRaw)).toEqual(newData);
        });

        test('setLocalData should merge data with existing data', () => {
            // 1. Set initial data
            Model.setLocalData({ theme: 'dark', user: 'guest' });

            // 2. Set new data
            Model.setLocalData({ language: 'en', user: 'admin' });

            // 3. Get the result
            const result = Model.getLocalData();

            expect(result).toEqual({ theme: 'dark', user: 'admin', language: 'en' });
        });

        test('clearLocalData should remove the item from localStorage', () => {
            Model.setLocalData({ theme: 'dark' });
            expect(localStorage.getItem(storageKey)).not.toBeNull();

            Model.clearLocalData();
            expect(localStorage.getItem(storageKey)).toBeNull();
        });
    });
});