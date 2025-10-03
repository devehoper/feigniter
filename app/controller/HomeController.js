class HomeController extends Controller {
    constructor() {
        super();
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

// This pattern allows the class to be used in two ways:
// 1. In the browser, it attaches itself to the window object.
// 2. In Node.js (for Jest tests), it's exported as a module.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeController;
} else {
    window.HomeController = HomeController;
}
