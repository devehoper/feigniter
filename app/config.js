// Configuration file for the application
const config = {
    appName: "Feigniter", // Name of the application
    homeController: "HomeController", // Default controller
    defaultMethod: "index", // Default method
    defaultLanguage: "pt", // Default language
    localStorage: "feigniter", // Local storage key
    debugMode: false, // Enable or disable debug mode
    useCache: true, // Enable or disable caching, dont change it, not full implemented for false case (V=0.1)
    useTranslation: true, // Enable or disable translation
    translationElementId: "language-selector", // ID of the language selector element
    availableLanguages: ["pt", "en"], // List of available languages
    useNavigationBar: true, // Use navigation bar for routing
    // if not using template set loadTemplate: {},
    loadTemplate: {
        views: ["app/view/header.html", "app/view/footer.html"], // Template views
        jsUrl: ["app/src/js/header.js", "app/src/js/footer.js"], // Template JavaScript files
        cssUrl: [
            //"app/src/css/pages/header.css"
            //"app/src/css/themes/default/pages/footer.css"
        ], // Template CSS files
    }, // Templates to load
    templateContentInsertIndex: 1, // Index to insert additional content views
    basePath: "https://feigniter.devehoper.com/", // Base path for the application

    //Begin Of Styling configs
    defaultTheme: "theme-default", // Default theme
    themes: ["theme-default", "theme-dark"], // Available themes
    themePath: "app/view/themes/", // Path to theme files
    //End Of Styling Configs

    libs: [ // External libraries to include using cdn
        {
            "name": "", // Library name
            version: 0.1, // Library version
            url: "http://google.com" // Library URL
        }
    ],
    enableCacheClearing: true // Enable cache clearing button in debug mode
};