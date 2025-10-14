export default class HomeController extends Controller {
    constructor() {
        super();
        Controller.loadModel("UserModel");
    }

    index() {
        super.loadView("app/view/home/content").then( () => {
            typeof app.singletons["header"] !== "undefined" ? app.singletons["header"].setActiveMenuItem(0) : null;
        });
    }

    features() {
        super.loadView("app/view/home/features").then( () => {
            typeof app.singletons["header"] !== "undefined" ? app.singletons["header"].setActiveMenuItem(1): null;
        });
    }

    compatibility() {
        super.loadView("app/view/home/compatibility").then( () => {
            typeof app.singletons["header"] !== "undefined" ? app.singletons["header"].setActiveMenuItem(2): null;
        });
    }

    faq() {
        super.loadView("app/view/home/faq").then( () => {
            typeof app.singletons["header"] !== "undefined" ? app.singletons["header"].setActiveMenuItem(3): null;
        });
    }

    about() {
        super.loadView("app/view/home/about").then( () => {
            typeof app.singletons["header"] !== "undefined" ? app.singletons["header"].setActiveMenuItem(4): null;
        });
    }

    documentation() {
        super.loadView("app/view/documentation").then( () => {
            typeof app.singletons["header"] !== "undefined" ? app.singletons["header"].setActiveMenuItem(5): null;
        });
    }
}
