const config = {
    appName: "Feigniter",
    homeController:"HomeController",
    defaultMethod: "index",
    debugMode: true,
    //if false url will be used in app.url
    useNavigationBar: true,

    basePath: "http://localhost/feigniter/",
    //external libs to be added
    libs: [
        {
            "name": "",
            version: 0.1,
            url: "http://google.com"
        }
    ]
};