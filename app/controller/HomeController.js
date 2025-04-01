export default class HomeController extends Controller {
    constructor() {
        super();
        this.search();
        super.loadModel("UserModel");
    }

    index() {
        super.loadPage(["app/view/home/content", "app/view/test"],"app/src/css/content.css");
    }

    about() {
        super.loadPage("app/view/home/about");
    }

    features() {
        super.loadPage("app/view/home/features");
    }

    compatibility() {
        super.loadPage("app/view/home/compatibility");
    }

    faq() {
        super.loadPage("app/view/home/faq", null, null, true);
    }

    search() {
        $(document).on('keyup', '#search', function(e) {
            e.preventDefault();
            app.log('Text changed');
        });
    }
}
