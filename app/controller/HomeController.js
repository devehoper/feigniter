export default class HomeController extends Controller {
    constructor() {
        super();
    }
    index() {
        super.loadView(["app/view/header.html", "app/view/home/content.html","app/view/footer.html"], "#feigniter", "app/src/css/content.css");
        this.search();
    }

    about() {
        super.loadView(["app/view/header.html", "app/view/home/about.html","app/view/footer.html"]);
        this.search();
    }

    features() {
        super.loadView(["app/view/header.html", "app/view/home/features.html","app/view/footer.html"]);
        this.search();
    }

    compatibility() {
        super.loadView(["app/view/header.html", "app/view/home/compatibility.html","app/view/footer.html"]);
        this.search();
    }

    faq() {
        super.loadView(["app/view/header.html", "app/view/home/faq.html","app/view/footer.html"]);
        this.search();
    }

    search() {
        $(document).on('keyup', '#search', function(e) {
            e.stopImmediatePropagation();
            alert('Text changed');
        });
    }
}