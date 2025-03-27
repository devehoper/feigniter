const config = {
    appName: "Feigniter",
    homeController:"HomeController",
    defaultMethod: "index",
    debugMode: true,
    useCache: true,
    //if false url will be used in app.url
    useNavigationBar: false,

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