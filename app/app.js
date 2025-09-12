class App {
  constructor() {
    // Initialize application state and caches
    this.url = "#" + config.homeController + "?" + config.defaultMethod;
    // History stack for navigation. Also using this to prevent page script to be loaded twice in Controller.loadViewContent
    this.history = [];
    this.controller = config.homeController;
    this.method = config.defaultMethod;
    this.args = [];
    this.controllerCache = {}; // Cache for loaded controllers
    this.viewCache = {}; // Cache for loaded views
    this.jsCache = {}; // Cache for loaded JavaScript files
    this.cssCache = {}; // Cache for loaded CSS files
    this.models = {}; // Models used in the application
    //this.actionRegistry = new ActionRegistry(); // Initialize the ActionRegistry
    this.data = Model.getLocalData(); // Load local data
    this.jsToLoad = []; // Object to hold JavaScript files to load
    this.cacheManager = {
      // Cache management utility
      clearAll: () => {
        this.controllerCache = {};
        this.viewCache = {};
        this.jsCache = {};
        this.cssCache = {};
        console.log("All caches cleared.");
      },
    };
  }

  // Function to validate and sanitize config.basePath
  sanitizeBasePath(basePath) {
    try {
      const validPathRegex = new RegExp(`(?:${config.basePath})[#?].*`);
      if (validPathRegex.test(basePath)) {
        return basePath;
      } else {
        throw new Error(`Invalid base path: ${basePath}`);
      }
    } catch (error) {
      ErrorHandler.logError(error.message);
      return config.basePath; // Fallback to default base path
    }
  }

  // Set up routing for the application
  async routing() {
    $(window).on("hashchange", this.handleHashChange.bind(this));
    $(document).on("click", "a", this.handleAnchorClick.bind(this));
  }

  // Handle changes in the URL hash
  handleHashChange() {
    let url = config.useNavigationBar ? window.location.hash : this.url; // Use app.url if navigation bar is disabled
    const { controller, method, args } = this.parseURL(url);

    this.controller = controller || config.homeController;
    this.method = method || config.defaultMethod;
    this.args = args;

    // Load the controller and method based on URL
    this.loadController(this.controller, this.method, this.args);

    if (config.useNavigationBar) {
      // Ensure controller and method are not null before updating the URL
      const newController = controller || config.homeController;
      const newMethod = method || config.defaultMethod;
      const newArgs = args.length > 0 ? args.join(",") : "";

      // Securely using history.replaceState
      try {
        // Ensure basePath ends with a slash
        const sanitizedBasePath = config.basePath.endsWith("/")
          ? config.basePath
          : config.basePath + "/";
        const newUrl = `${sanitizedBasePath}#${newController}?${newMethod}=${newArgs}`;
        history.replaceState(null, null, newUrl);
      } catch (error) {
        ErrorHandler.logError("Error updating URL:", error.message);
      }
    }
    $("#feigniter").empty();
    //this.runTemplateJs();
    //this.jsToLoad = {}; // Clear jsToLoad after execution
  }

  // run js from template pages
  runTemplateJs() {
    let _this = this;

    $(document).ready(() => {
        console.log("Document ready for running template JS");

        if (typeof _this.jsToLoad === "object" && Object.keys(_this.jsToLoad).length > 0) {
            for (let id in _this.jsToLoad) {
                const url = _this.jsToLoad[id];
                if (app.jsCache[url]) {
                    try {
                        const scriptContent = $("#" + id).text(); // Retrieve script content by ID
                        if (scriptContent) {
                            eval(scriptContent); // Execute script content (use cautiously)
                        } else {
                            console.error(`No content found for script with ID: ${id}`);
                        }
                    } catch (error) {
                        console.error(`Error executing script for ID: ${id}, URL: ${url}`, error);
                    }
                } else {
                    console.warn(`Script not found in cache for URL: ${url}`);
                }
            }
        } else {
            console.error("Invalid or empty jsToLoad property.");
        }
    });
}

  // Handle anchor click events
  handleAnchorClick(e) {
    if (!config.useNavigationBar && $(e.currentTarget).attr("target") !== "_blank") {
      e.preventDefault();

      const href = $(e.currentTarget).attr("href");
      this.url = href;
      this.history.push(href); // Push the new URL to history
      // Trigger hashchange event for navigation
      $(window).trigger("hashchange");
    }
  }



  // Parse the URL into controller, method, and arguments
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

  // Load a controller and execute a method with arguments
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

  // Execute a method on a controller instance
  executeMethod(controllerInstance, method, args) {
    if (controllerInstance && typeof controllerInstance[method] === 'function') {
        controllerInstance[method](...args);
    } else {
        console.error(`Method ${method} not found on controller instance`);
    }
  }

  // Handle DOM actions based on data attributes
  handleDOMActions() {
    $('[data-feigniter-action-type]').each((index, element) => {
      const $element = $(element);
      const actionName = $element.data('feigniter-action-type');
      if (actionName && !$element.data('feigniter-processed')) {
        this.actionRegistry.executeAction(actionName, element);
        $element.data('feigniter-processed', true); // Mark the element as processed
      }
    });
  }

  // Observe DOM changes and handle actions dynamically
  observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          //this.handleDOMActions();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    });
  }

  // Log messages in debug mode
  log(text) {
    if(config.debugMode) {
      console.log(text);
    }
  }

  // Translate the application based on the given language
  translate (language) {
    if(typeof language === "undefined") {
       language = this.models.AppModel.language || config.defaultLanguage
    }
    this.log("Translating to " + language);
    $(document).ready(() => {
      this.log("translate");
      if(config.useTranslation && typeof this.models.AppModel !== "undefined") {
        this.models.AppModel['language'] = language;
        Model.setLocalData({language: language});
        i18next.changeLanguage(language).then(
          () => {
            this.log("Current language in i18next:", i18next.language);
            $('[data-translate]').each(function () {
              const key = $(this).data('translate');
              $(this).text(i18next.t(key));
            });
          }
        );
      }
    });
  }

  // Initialize the translation library
  setLanguage() {
    i18next
      .use(i18nextHttpBackend)
      .init(
        {
          fallbackLng: config.defaultLanguage,
          lng: app.data.language || config.defaultLanguage,
          backend: {
            loadPath: 'app/locales/{{lng}}.json',
          },
        },
        (err, t) => {
          if (err) {
            ErrorHandler.logError('Error initializing i18next:', err);
          } else {
            this.updateTranslations();
          }
        }
      );
  }

  // Update translations for elements with data-translate attributes
  updateTranslations() {
    $('[data-translate]').each(function () {
      const key = $(this).data('translate');
      $(this).text(i18next.t(key));
    });
  }

  setTheme(theme) {
    $(document).ready(() => {
      const appModel = this.models?.AppModel;
      theme = theme || this.data?.theme || appModel?.theme || config.defaultTheme;

      Controller.unloadCSS();
      Controller.loadCss(`app/src/css/themes/${theme}/${theme}.css`);

      if (appModel) {
        appModel.setTheme?.(theme);
        Model.setLocalData({ theme });
      }

      $("body").removeClass(config.themes.join(" ")).addClass(theme);
    });
  }


  // Initialize the application
  init() {
    this.log("init");
    $(document).ready(async () => {
      Controller.loadModel("AppModel");
      // Set the Application wrapper
      if ($("#feigniter").length == 0) {
        await $("body").prepend(`<div id='feigniter'></div>`);
      }

      await this.setTheme();

      await this.routing();
      await $(window).trigger("hashchange");
      // await this.handleDOMActions();
      await this.observeDOMChanges();

      // Dynamically load translation scripts if useTranslation is enabled
      if (config.useTranslation) {
        try {
          await Controller.loadJs([
            "app/src/js/lib/i18next.js",
            "app/src/js/lib/i18nextbackend.js"
          ]);
          await this.setLanguage(); // Initialize translation after scripts are loaded
          app.translate(); // Initial translation
        } catch (error) {
          ErrorHandler.logError("Failed to load translation scripts", error);
        }
      }

      // Add a button to clear cache for debugging
      if (config.debugMode) {
        $("body").append('<button id="clearCache">Clear Cache</button>');
        $("#clearCache").on("click", () => this.cacheManager.clearAll());
      }
    });
  }

  // // Dynamically load JavaScript files
  // loadJs(urls) {
  //   return new Promise((resolve, reject) => {
  //     if (!urls) return resolve();

  //     const jsArray = Array.isArray(urls) ? urls : [urls];
  //     const promises = jsArray.map((url) => new Promise((res, rej) => {
  //       if (app.jsCache[url] && config.useCache) {
  //         this.log(`JS already loaded: ${url}`);
  //         return res();
  //       }
  //       const script = document.createElement("script");
  //       script.src = url;
  //       script.defer = true;
  //       script.onload = () => {
  //         app.jsCache[url] = true;
  //         res();
  //       };
  //       script.onerror = () => {
  //         ErrorHandler.logError(`Error loading JS: ${url}`);
  //         rej(new Error(`Error loading JS: ${url}`));
  //       };
  //       document.head.appendChild(script);
  //     }));

  //     Promise.all(promises).then(resolve).catch(reject);
  //   });
  // }
}

// Example of registering actions
let app = new App();
// app.actionRegistry.registerAction('test');
// app.actionRegistry.registerAction('table');

app.init();
