export default class HomeController extends Controller {
    constructor() {
        super();
    }

    index() {
        super.loadView(
            "app/view/home/content", // Only specify the content view
            "app/src/css/themes/default/pages/content.css",
            "app/src/js/home/content.js", // Specify the JavaScript file for the content view
        );
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
        super.loadView("app/view/home/faq");
    }

    documentation() {
        super.loadView("app/view/documentation");
    }

    // search() {
    //     $(document).on('keyup', '#search', function(e) {
    //         e.preventDefault();
    //         app.log('Text changed');
    //     });
    // }
}
