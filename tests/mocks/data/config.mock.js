// d:/xampp/htdocs/feigniter/tests/mocks/data/config.mock.js
// This file centralizes the mock configuration data for Jest tests.

const config = {
    appName: "Feigniter",
    homeController: "HomeController",
    defaultMethod: "index",
    defaultLanguage: "en",
    localStorage: "feigniter_test",
    appContainerSelector: "#feigniter",
    debugMode: true,
    useCache: false,
    useTranslation: true,
    useNavigationBar: false,
    loadTemplate: {
        views: ["app/view/header.html"],
        jsUrl: ["app/src/js/header.js"],
        cssUrl: ["app/src/css/pages/header.css"],
    },
    templateContentInsertIndex: 1,
    basePath: "https://localhost/feigniter/",
};

// In a test environment, userConfig can often be the same as the base config.
const userConfig = { ...config };

module.exports = { config, userConfig };