/**
 * @jest-environment jsdom
 */

// Since userConfig is a global variable attached to the window,
// we need to load it into our test environment.
const fs = require('fs');
const path = require('path');

const userConfigPath = path.resolve(__dirname, '../app/userConfig.js');
const userConfigExists = fs.existsSync(userConfigPath);

describe('User Configuration', () => {
    // Conditionally run tests only if userConfig.js exists
    if (userConfigExists) {
        const userConfigScript = fs.readFileSync(userConfigPath, 'utf-8');

        // Execute the script to define the global userConfig object before tests run
        beforeAll(() => {
            // We modify the script to assign userConfig to the window object,
            // making it globally available in the JSDOM environment.
            new Function(userConfigScript.replace('const userConfig =', 'window.userConfig ='))();
        });

        it('should have the required properties with the correct types', () => {
            expect(userConfig).toEqual(expect.any(Object));
            expect(userConfig.appName).toEqual(expect.any(String));
            expect(userConfig.homeController).toEqual(expect.any(String));
            expect(userConfig.defaultMethod).toEqual(expect.any(String));
            expect(userConfig.appContainerSelector).toEqual(expect.any(String));
            expect(typeof userConfig.debugMode).toBe('boolean');
        });
    } else {
        it('should skip tests because userConfig.js is optional and was not found', () => {
            console.log('Skipping userConfig.js tests: File not found.');
            expect(true).toBe(true); // Pass the test trivially
        });
    }
});

//         expect(userConfig.homeController).toEqual(expect.any(String));
//         expect(userConfig.defaultMethod).toEqual(expect.any(String));
//         expect(userConfig.appContainerSelector).toEqual(expect.any(String));
//         expect(typeof userConfig.debugMode).toBe('boolean');
//     });
// });