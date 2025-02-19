class App {
  constructor() {
    this.url = "#HomeController?index";
    this.controller = config.homeController;
    this.method = config.defaultMethod;
    this.args = [];
    this.controllerCache = {}; // Cache for loaded controllers
    this.viewCache = {}; // Cache for loaded views
  }

  // full url: https://localhost/feigniter/#controllerName?MethodName=arg1,arg2,arg3
  routing() {
    $(window).on("hashchange", (e) => {
      let url = config.useNavigationBar ? window.location.hash : this.url;
      const { controller, method, args } = this.parseURL(url);

      this.controller = controller || config.homeController;
      this.method = method || config.defaultMethod;
      this.args = args;

      console.log(`Controller: ${this.controller}, Method: ${this.method}, Args: ${this.args}`);
      this.loadController(this.controller, this.method, this.args);

      if (!config.useNavigationBar) {
        // Ensure controller and method are not null before updating the URL
        const newController = controller || config.homeController;
        const newMethod = method || config.defaultMethod;
        const newArgs = args.length > 0 ? args.join(",") : "";

        // Update the URL without triggering a page reload
        history.replaceState(null, null, `http://localhost/feigniter`);
        this.url = `#${newController}?${newMethod}=${newArgs}`;
      }
    });

    // Handle click events on <a> elements
    $(document).on("click", "a", (e) => {
      if (!config.useNavigationBar) {
        e.preventDefault();
        const href = $(e.currentTarget).attr("href");
        this.url = href;
        $(window).trigger("hashchange");
      }
    });
  }

  parseURL(url) {
    const controllerStrPosition = url.indexOf("#");
    const methodStrPosition = url.indexOf("?");
    const argsStrPosition = url.indexOf("=");

    const controller = controllerStrPosition != -1
      ? url.substring(controllerStrPosition + 1, methodStrPosition != -1 ? methodStrPosition : url.length)
      : null;

    const method = methodStrPosition != -1
      ? url.substring(methodStrPosition + 1, argsStrPosition != -1 ? argsStrPosition : url.length)
      : null;

    const args = argsStrPosition != -1
      ? url.substring(argsStrPosition + 1).split(",")
      : [];

    return { controller, method, args };
  }

  async loadController(controller, method, args) {
    console.log(
      `Loading controller: ${controller}, method: ${method}, with args: ${args}`
    );

    if (this.controllerCache[controller]) {
      console.log(`Using cached controller: ${controller}`);
      this.executeMethod(this.controllerCache[controller], method, args);
    } else {
      try {
        const script = document.createElement('script');
        script.src = `./app/controller/${controller}.js`;
        script.type = 'module';
        script.onload = () => {
          import(`./controller/${controller}.js`).then((module) => {
            this.controllerCache[controller] = module.default;
            console.log(`Loaded controller: ${controller}`);
            this.executeMethod(module.default, method, args);
          }).catch((error) => {
            console.error(`Error loading controller: ${controller}`, error);
          });
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error(`Error loading controller: ${controller}`, error);
      }
    }
  }

  executeMethod(controller, method, args) {
    if (controller && typeof controller[method] === 'function') {
      controller[method](...args);
    } else if (typeof controller.prototype[method] == 'function') {
      controller.prototype[method](...args);
    } else {
      console.error(`Method ${method} not found on controller ${controller}`);
    }
  }

  init() {
    console.log("init");
    $(document).ready(() => {
      this.routing();
      $(window).trigger("hashchange");
    });
  }
}

var app = new App();
app.init();
