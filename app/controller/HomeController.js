export default class HomeController extends Controller {
    constructor() {
        super();
        this.search();
        super.loadModel("UserModel");
    }

    index() {
        super.loadPage("content","app/src/css/content.css");
    }

    about() {
        super.loadPage("about");
    }

    features() {
        super.loadPage("features");
    }

    compatibility() {
        super.loadPage("compatibility");
    }

    faq() {
        super.loadPage("faq", null, null, true);
    }

    search() {
        $(document).on('keyup', '#search', function(e) {
            e.preventDefault();
            app.log('Text changed');
        });
    }
}
