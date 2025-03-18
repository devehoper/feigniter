export default class TestController extends Controller {
    constructor() {
        super();
    }
    index() {
        super.loadView({
            viewUrl: ["app/view/header.html", "app/view/test.html", "app/view/footer.html"],

        });
    }
}