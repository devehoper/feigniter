class App {
  constructor() {
    this.url = "#HomeController?index";
    this.controller = config.homeController;
    this.method = config.defaultMethod;
    this.args = [];
    this.controllerCache = {}; // Cache for loaded controllers
    this.viewCache = {}; // Cache for loaded views
    this.jsCache = {}
    this.cssCache = {}; // cache for loaded css files
    this.models = {};
    this.actionRegistry = new ActionRegistry(); // Initialize the ActionRegistry
  }

  // Function to validate and sanitize config.basePath
  sanitizeBasePath(basePath) {
    // Basic validation for a path
    const validPathRegex = new RegExp(`(?:${config.basePath})[#?].*`);
    if (validPathRegex.test(basePath)) {
      return basePath;
    }
  }

  // full url example: https://localhost/feigniter/#controllerName?MethodName=arg1,arg2,arg3
  routing() {
    $(window).on("hashchange", this.handleHashChange.bind(this));
    $(document).on("click", "a", this.handleAnchorClick.bind(this));
  }
  
  handleHashChange() {
    let url = config.useNavigationBar ? window.location.hash : this.url;
    const { controller, method, args } = this.parseURL(url);
  
    this.controller = controller || config.homeController;
    this.method = method || config.defaultMethod;
    this.args = args;
  
    // Load the controller and method based on URL
    this.loadController(this.controller, this.method, this.args);
  
    if (!config.useNavigationBar) {
      // Ensure controller and method are not null before updating the URL
      const newController = controller || config.homeController;
      const newMethod = method || config.defaultMethod;
      const newArgs = args.length > 0 ? args.join(",") : "";
  
      // Securely using history.replaceState
      try {
        const sanitizedBasePath = this.sanitizeBasePath(config.useNavigationBar
          ? config.basePath
          : this.url);
        history.replaceState(null, null, sanitizedBasePath);
  
        this.url = `#${newController}?${newMethod}=${newArgs}`;
      } catch (error) {
        console.error('Error updating URL:', error.message);
        // Optionally handle the error, e.g., show a notification
      }
    }
  }
  
  handleAnchorClick(e) {
    if (!config.useNavigationBar && $(e.currentTarget).attr("target") !== "_blank") {
      e.preventDefault();
  
      const href = $(e.currentTarget).attr("href");
      this.url = href;
  
      // Trigger hashchange event for navigation
      $(window).trigger("hashchange");
    }
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
    this.log(
        `Loading controller: ${controller}, method: ${method}, with args: ${args}`
    );

    if (this.controllerCache[controller]) {
        this.log(`Using cached controller: ${controller}`);
        this.executeMethod(this.controllerCache[controller], method, args);
    } else {
        try {
            const script = document.createElement('script');
            script.src = `./app/controller/${controller}.js`;
            script.type = 'module';
            script.nosniff;
            script.onload = () => {
                import(`./controller/${controller}.js`).then((module) => {
                    const ControllerClass = module.default;
                    const controllerInstance = new ControllerClass(); // Instantiate the controller
                    this.controllerCache[controller] = controllerInstance;
                    this.log(`Loaded controller: ${controller}`);
                    this.executeMethod(controllerInstance, method, args);
                }).catch((error) => {
                    console.error(`Error loading controller: ${controller}`, error);
                });
            };
            document.body.appendChild(script);
        } catch (error) {
            console.error(`Error loading controller: ${controller}`, error);
        }
    }
}

executeMethod(controllerInstance, method, args) {
    if (controllerInstance && typeof controllerInstance[method] === 'function') {
        controllerInstance[method](...args);
    } else {
        console.error(`Method ${method} not found on controller instance`);
    }
}

  handleDOMActions() {
    // Find elements with data-feigniter-actionName attribute and perform actions
    $('[data-feigniter-action-type]').each((index, element) => {
      const $element = $(element);
      const actionName = $element.data('feigniter-action-type');
      if (actionName && !$element.data('feigniter-processed')) {
        this.actionRegistry.executeAction(actionName, element);
        $element.data('feigniter-processed', true); // Mark the element as processed
      }
    });
  }

  observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          this.handleDOMActions();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    });
  }

  log(text) {
    if(config.debugMode) {
      console.log(text);
    }
  }

  translate () {
    $('[data-translate]').each(function () {
      const key = $(this).data('translate');
      $(this).text(i18next.t(key));
    });
  }

  setLanguage() {
    i18next.use(i18nextHttpBackend).init({
      fallbackLng: 'en',
      lng: 'en', // Default language
      backend: {
        loadPath: 'app/locales/{{lng}}.json' // Path to your JSON translation files
      }
    }, function(err, t) {
      if (err) console.error('Error initializing i18next:', err);
  
      // Update text on the page with translations
      updateContent();
    });
  
    // Function to update content
    const updateContent = () => {
      $('[data-translate]').each(function() {
        const key = $(this).data('translate');
        $(this).text(i18next.t(key)); // Fetch translation for each key
      });
    };

    // Language change buttons
    // $('#lang-en').click(function() {
    //   i18next.changeLanguage('en', updateContent); // Change to English
    // });

    // $('#lang-pt').click(function() {
    //   i18next.changeLanguage('pt', updateContent); // Change to Portuguese
    // });
  }

  init() {
    this.log("init");
    $(document).ready(() => {
      // Set the Application wrapper
      if ($("#feigniter").length == 0) {
        $("body").prepend("<div id='feigniter'></div>");
      }
      this.routing();
      $(window).trigger("hashchange");
      this.handleDOMActions();
      this.observeDOMChanges();
      this.setLanguage();
    });
  }
}

// Example of registering actions
const app = new App();
app.actionRegistry.registerAction('test');
app.actionRegistry.registerAction('table');
app.init();
