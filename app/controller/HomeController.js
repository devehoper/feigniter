export default class HomeController extends Controller {
    constructor() {
        super();
        this.communViews = ["app/view/header.html","app/view/footer.html"];
        this.search();
        this.loadModel("UserModel");

    }

    index() {
        super.loadView({
            viewUrl: ["app/view/header.html", "app/view/home/content.html", "app/view/footer.html"],
            cssUrl: "app/src/css/content.css"
        });
    }

    about() {
        super.loadView({
            viewUrl: ["app/view/header.html", "app/view/home/about.html", "app/view/footer.html"],
        });
    }

    features() {
        super.loadView({
            viewUrl: ["app/view/header.html", "app/view/home/features.html", "app/view/footer.html"],
        });
    }

    compatibility() {
        super.loadView({
            viewUrl: ["app/view/header.html", "app/view/home/compatibility.html", "app/view/footer.html"],
        });
    }

    faq() {
        super.loadView({
            insertAfter: true,
            viewUrl: ["app/view/header.html", "app/view/home/faq.html", "app/view/footer.html"],
        });
    }

    search() {
        $(document).on('keyup', '#search', function(e) {
            e.preventDefault();
            app.log('Text changed');
        });
    }
}