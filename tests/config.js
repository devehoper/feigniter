const mockUserConfig = {
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

// For many tests, making them identical simplifies the setup.
const mockConfig = mockUserConfig;

module.exports = { mockUserConfig, mockConfig };