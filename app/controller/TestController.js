class TestController extends Controller {
    constructor() {
        super();
    }
    index() {
        super.loadView("app/view/test.html").then( () => {
            const vue = app.singletons.vue;
            if (!vue) { // Guard clause: exit if Vue singleton isn't available
                return;
            }

            const MyComponent = {
                template: `<div style="padding:1rem; background:#eef;">Vue is working 🎉</div>`
            };
            vue.mount(MyComponent, "#vue-root");
        });
    }
}