/**
 * Centralized mock configuration for Jest tests.
 * These values are loaded into the `global` scope in `setupTests.js`.
 */
const mockConfig = {
    homeController: 'HomeController',
    defaultMethod: 'index',
    appContainerSelector: '#feigniter',
    basePath: '/',
    useNavigationBar: true,
    useTranslation: true,
    debugMode: true,
    defaultLanguage: 'en',
    preHooks: [],
    postHooks: [],
};

// In tests, userConfig can often just be an empty object, allowing the
// main config to provide the default values.
const mockUserConfig = {};

module.exports = { mockUserConfig, mockConfig };
