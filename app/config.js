// Configuration file for the application
const config = {
    appName: "Feigniter", // Name of the application
    homeController: "HomeController", // Default controller
    defaultMethod: "index", // Default method
    defaultLanguage: "pt", // Default language
    localStorage: "feigniter", // Local storage key
    debugMode: false, // Enable or disable debug mode
    useCache: true, // Enable or disable caching
    useTranslation: true, // Enable or disable translation
    translationElementId: "language-selector", // ID of the language selector element
    availableLanguages: ["pt", "en"], // List of available languages
    useNavigationBar: false, // Use navigation bar for routing
    loadTemplate: ["app/view/header.html", "app/view/footer.html"], // Templates to load
    templateIndexToLoad: 1, // Index to insert additional templates
    basePath: "https://localhost/feigniter/", // Base path for the application
    
    //Begin Of Styling configs
    defaultTheme: "theme-default", // Default theme
    themes: ["theme-default", "theme-dark"], // Available themes
    themePath: "app/view/themes/", // Path to theme files
    //End Of Styling Configs

    libs: [ // External libraries to include
        {
            "name": "", // Library name
            version: 0.1, // Library version
            url: "http://google.com" // Library URL
        }
    ],
    enableCacheClearing: true // Enable cache clearing button in debug mode
};