export default class HomeController extends Controller {
    constructor() {
        super();
        this.search();
        super.loadModel("UserModel");
    }

    index() {
        super.loadView(["app/view/home/content", "app/view/test"],"app/src/css/content.css", "app/src/js/header.js");
    }

    about() {
        super.loadView("app/view/home/about");
    }

    features() {
        super.loadView("app/view/home/features");
    }

    compatibility() {
        super.loadView("app/view/home/compatibility");
    }

    faq() {
        super.loadView("app/view/home/faq", null, null, true);
    }

    search() {
        $(document).on('keyup', '#search', function(e) {
            e.preventDefault();
            app.log('Text changed');
        });
    }
}
