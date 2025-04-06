export default class TestController extends Controller {
    constructor() {
        super();
    }
    index() {
        super.loadView("app/view/test.html");
    }
}