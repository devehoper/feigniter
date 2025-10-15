// Configuration file for the application
const config = {
    appName: "Feigniter", // Name of the application
    homeController: "HomeController", // Default controller
    defaultMethod: "index", // Default method
    defaultLanguage: "pt", // Default language
    localStorage: "feigniter", // Local storage key
    appContainerSelector: "#feigniter", // Wrappper that contains all the app content

    useVue: false,

    debugMode: true, // Enable or disable debug mode
    useCache: false, // Enable or disable caching, dont change it, not full implemented for false case (V=0.1)
    enableCacheClearing: true, // Enable cache clearing button in debug mode

    useTranslation: true, // Enable or disable translation
    availableLanguages: ["pt", "en"], // List of available languages

    useNavigationBar: false, // Use navigation bar for routing
    // if not using template set loadTemplate: {},
    loadTemplate: {
        views: ["app/view/header.html", "app/view/footer.html"], // Template views
        jsUrl: ["app/src/js/header.js", "app/src/js/footer.js"], // Template JavaScript files
        cssUrl: [
            "app/src/css/pages/header.css",
            "app/src/css/pages/footer.css"
        ], // Template CSS files
    }, // Templates to load
    templateContentInsertIndex: 1, // Index to insert additional content views
    basePath: "https://localhost/feigniter/", // Base path for the application
    backendPath: "", // Backend path for API calls

    //Begin Of Styling configs
    defaultTheme: "theme-default", // Default theme
    themes: ["theme-default", "theme-dark"], // Available themes
    themePath: "app/view/themes/", // Path to theme files
    //End Of Styling Configs
    
    //callbacks to call on each controller.contructor(preHooks)
    preHooks: [],
    //callbacks to call on each loadController(...).then(postHooks)
    postHooks: []
};