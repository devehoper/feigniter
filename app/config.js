// In the config file there're setted the default settings
// Check Model/AppModel.js that contains a global scope for app state
const config = {
    appName: "Feigniter",
    homeController:"HomeController",
    defaultMethod: "index",
    defaultLanguage: "pt",
    localStorage: "feigniter",
    debugMode: true,
    useCache: true,
    useTranslation: true,
    //select that contains available language list
    translationElementId: "language-selector",
    availableLanguages : ["pt", "en"],
    //if false url will be used in app.url
    useNavigationBar: false,

    loadTemplate: ["app/view/header.html", "app/view/footer.html"],
    templateIndexToLoad: 1,

    basePath: "http://localhost/feigniter/",
    //@todo external libs to be added
    libs: [
        {
            "name": "",
            version: 0.1,
            url: "http://google.com"
        }
    ]
};