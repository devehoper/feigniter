// User configuration file for the application
const userConfig = {
    appName: "Feigniter", // Name of the application
    homeController: "HomeController", // Default controller
    defaultMethod: "index", // Default method
    defaultLanguage: "pt", // Default language
    localStorage: "feigniter", // Local storage key
    appContainerSelector: "#feigniter", // Wrappper that contains all the app content

    useVue: false,

    debugMode: false, // Enable or disable debug mode
    useCache: true, // Enable or disable caching, dont change it, not full implemented for false case (V=0.1)
    enableCacheClearing: false, // Enable cache clearing button in debug mode

    useTranslation: true, // Enable or disable translation
    availableLanguages: ["pt", "en"], // List of available languages

    useNavigationBar: true, // Use navigation bar for routing
     // Templates to load
    templateContentInsertIndex: 1, // Index to insert additional content views
    // IMPORTANT: Change the basePath to your live domain when deploying to production!
    // Example: "https://www.yourwebsite.com/"
    backendPath: "https://api.devehoper.com/v1/", // Backend path for API calls
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