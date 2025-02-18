export default class HomeController extends Controller {
    index() {
        console.log("HOME INDEX");
        super.loadView(["app/view/header.html", "app/view/footer.html"]);
    }

    login() {
        super.loadView(["app/view/header.html","app/view/login.html"]);
    }

    MethodName(args) {
        console.log(args);
    }
}