class App {
  constructor() {
    // Initialize application state and caches
    this.url = `#${userConfig.homeController ?? config.homeController}?${userConfig.defaultMethod ?? config.defaultMethod}`;
    // History stack for navigation. Also using this to prevent page script to be loaded twice in Controller.loadViewContent
    this.history = [];
    this.controller = userConfig.homeController ?? config.homeController;
    this.method = userConfig.defaultMethod ?? config.defaultMethod;
    this.args = [];
    this.controllerCache = {}; // Cache for loaded controllers
    this.viewCache = {}; // Cache for loaded views
    this.jsCache = {}; // Cache for loaded JavaScript files
    this.cssCache = {}; // Cache for loaded CSS files
    this.models = {}; // Models used in the application
    this.actionRegistry = new ActionRegistry(); // Initialize the ActionRegistry
    this.data = Model.getLocalData(); // Loads data from localstorage
    this.jsToLoad = []; // Object to hold JavaScript files to load
    this.singletons = {}; // Object to hold singleton instances
    // Cache management utility
    this.cacheManager = {
      clearAll: () => {
        this.controllerCache = {};
        this.viewCache = {};
        this.jsCache = {};
        this.cssCache = {};
        Model.clearLocalData();
        window.location.reload();
      },
    };
  }

  // Function to validate and sanitize config.basePath
  sanitizeBasePath(basePath) {
    try {
      const validPathRegex = new RegExp(`(?:${(userConfig.basePath ?? config.basePath)})[#?].*`);
      if (validPathRegex.test(basePath)) {
        return basePath;
      } else {
        throw new Error(`Invalid base path: ${basePath}`);
      }
    } catch (error) {
      return (userConfig.basePath ?? config.basePath); // Fallback to default base path
    }
  }

  // Set up routing for the application
  async routing() {
    $(window).on("hashchange", this.handleHashChange.bind(this));
    $(document).on("click", "a", this.handleAnchorClick.bind(this));
  }

  // Handle changes in the URL hash
  handleHashChange() {
    let url = (userConfig.useNavigationBar ?? config.useNavigationBar) ? window.location.hash : app.url; // Use app.url if navigation bar is disabled
    const { controller, method, args } = this.parseURL(url);

    this.controller = controller || (userConfig.homeController ?? config.homeController);
    this.method = method || (userConfig.defaultMethod ?? config.defaultMethod);
    this.args = args;

    // Load the controller and method based on URL
    this.loadController(this.controller, this.method, this.args).then(() => {

    }).then(() => {
      // After loading the controller, run singletons
      this.runSingletons();
    });

    //if (config.useNavigationBar) {
      // Ensure controller and method are not null before updating the URL
      const newController = controller || (userConfig.homeController ?? config.homeController);
      const newMethod = method || (userConfig.defaultMethod ?? config.defaultMethod);
      const newArgs = args.length > 0 ? args.join(",") : "";

      // Securely using history.replaceState
      try {
        let basePath = userConfig.basePath ?? config.basePath;
        // Ensure basePath ends with a slash
        const sanitizedBasePath = basePath.endsWith("/")
          ? basePath
          : basePath + "/";
        const newUrl = `${sanitizedBasePath}#${newController}?${newMethod}=${newArgs}`;
        if(userConfig.useNavigationBar ?? config.useNavigationBar) {
          history.replaceState(null, null, newUrl);
        }
      } catch (error) {
      }
    //}
    $(userConfig.appContainerSelector ?? config.appContainerSelector).empty();
    //this.runTemplateJs();
    //this.jsToLoad = {}; // Clear jsToLoad after execution
  }

  setSingleton(name, instance) {
    if (!app.singletons[name]) {
      app.singletons[name] = new instance();
    }
  }
  runSingletons() {
    $(document).ready(() => {
      for(let key in app.singletons) {
        if(app.singletons[key]) {
          // Re-initialize singleton instances if they have an init method
          if (typeof app.singletons[key].update === 'function') {
            app.singletons[key].update();
          }
        }
      }
    });
  }

  // Handle anchor click events
  handleAnchorClick(e) {
    const href = $(e.currentTarget).attr("href");
    if (!(userConfig.useNavigationBar ?? config.useNavigationBar) && $(e.currentTarget).attr("target") !== "_blank") {
      e.preventDefault();
      this.url = href;
      this.history.push(href); // Push the new URL to history
      // Trigger hashchange event for navigation
      $(window).trigger("hashchange");
    }
  }

  navigate() {
    // let fullUrl = app.parseURL(url);
    // let controller = fullUrl.controller || controller;
    // let method = fullUrl.method || method;
    // let args = fullUrl.args.length > 0 ? fullUrl.args : [];
    // const argsStr = args.length > 0 ? args.join(",") : "";
    // const hash = `#${controller}?${method}${argsStr ? '=' + argsStr : ''}`;
    window.location.hash = app.url;
    // Optionally, you can trigger handleHashChange directly if you want to avoid hashchange event:
    this.handleHashChange();
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
  if (this.controllerCache[controller]) {
    this.executeMethod(this.controllerCache[controller], method, args);
    return;
  }

  try {
    // Use dynamic import directly. It handles both fetching and executing the module.
    // The path is relative to the current file (app.js), so '../controller/' is correct.
    const module = await import(`../controller/${controller}.js`);
    
    // ES modules export a `default` property for the default export.
    const ControllerClass = module.default;
    const controllerInstance = new ControllerClass();
    
    this.controllerCache[controller] = controllerInstance;
    this.executeMethod(controllerInstance, method, args);
    
  } catch (error) {
    app.error(`Error loading controller: ${controller}`, error);
  }
}


  // Execute a method on a controller instance
  executeMethod(controllerInstance, method, args) {
    if (controllerInstance && typeof controllerInstance[method] === 'function') {
        controllerInstance[method](...args);
    } else {
        app.error(`Method ${method} not found on controller instance`);
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

  // Log messages in debug mode
  log(text) {
    if (userConfig.debugMode ?? config.debugMode) {
      console.log(text);
    }
  }

   // Log messages in debug mode
  warn(text) {
    if (userConfig.debugMode ?? config.debugMode) {
      console.warn(text);
    }
  }

   // Log messages in debug mode
  error(text, error = null) {
    if (userConfig.debugMode ?? config.debugMode) {
      console.error(text, error || '');
    }
  }

  // Translate the application based on the given language
  translate (language) {
    if( userConfig.useTranslation ?? config.useTranslation) {
      if(typeof language === "undefined") {
        if(typeof app.data["language"] === "undefined") {
          language = (userConfig.defaultLanguage ?? config.defaultLanguage);
        } else {
          language = app.data["language"];
        }
      } else {
        app.data["language"] = language;
      }

      Model.setLocalData({"language": language});
      $(document).ready(() => {
        if((userConfig.useTranslation ?? config.useTranslation)) {
          i18next.changeLanguage(language).then(
            () => {
              $('[data-translate]').each(function () {
                const key = $(this).data('translate');
                $(this).text(i18next.t(key));
              });
            }
          );
        }
      });
    }
  }

  async request (data) {
    const method = (data.method || "GET").toUpperCase();
    let contentType = data.contentType;
    let processData = data.processData;

    // For POST/PUT, default to JSON content type and disable jQuery's data processing
    // if we are sending a string (which we assume is JSON).
    if (method === 'POST' || method === 'PUT') {
      if (contentType === undefined) {
        contentType = "application/json";
      }
      if (processData === undefined && typeof data.data === 'string') {
        processData = false;
      }
    }

    return $.ajax({
      url: data.url,
      method: method,
      data: data.data || {},
      headers: data.headers || {},
      dataType: data.dataType || "json",
      contentType: contentType,
      processData: processData,
      beforeSend: data.beforeSend || function() {},
      success: data.success || function(response) {},
      error: data.error || function(jqXHR, textStatus, errorThrown) {},
      complete: data.complete || function() {},
    });
  }

  // Initialize the translation library
  setLanguage() {
    if(userConfig.useTranslation ?? config.useTranslation) {
      let language = typeof app.data.language === "undefined" ? (userConfig.defaultLanguage ?? config.defaultLanguage) : app.data.language;

      i18next
        .use(i18nextHttpBackend)
        .init(
          {
            fallbackLng: (userConfig.defaultLanguage ?? config.defaultLanguage),
            lng: language,
            backend: {
              loadPath: 'app/locales/{{lng}}.json',
            },
          },
          (err, t) => {
            if (err) {
            } else {
              this.updateTranslations();
            }
          }
        );
      }
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
      let themes = userConfig.themes ?? config.themes;
      theme = theme || this.data?.theme || (userConfig.defaultTheme ?? config.defaultTheme);

      Controller.unloadCSS();
      Controller.loadCss(`app/src/css/themes/${theme}/${theme}.css`);

      Model.setLocalData({ theme });

      $("body").removeClass(themes.join(" ")).addClass(theme);
    });
  }

  // Initialize the application
  async init() {
    $(document).ready(async () => {
      if(userConfig.useCache ?? config.useCache) {
        await app.startServiceWorker();
      }
      app.data = Model.getLocalData();
      let appContainerSelector = userConfig.appContainerSelector ?? config.appContainerSelector;
      let bp = userConfig.basePath ?? config.basePath;
      // Set the Application wrapper
      if ($(appContainerSelector).length == 0) {
        await $("body").prepend(`<div id='${appContainerSelector.substring(1,appContainerSelector.length)}'></div>`);
      }
      await this.routing();
      await this.setTheme();
      await $(window).trigger("hashchange");
      await this.observeDOMChanges();
      if (userConfig.useTranslation ?? config.useTranslation) {
        app.setLanguage();
        
      }

      // Add a button to clear cache for debugging
      if (userConfig.debugMode ?? config.debugMode) {
        $("body").append('<button id="clearCache" class="btn btn-error">Clear Cache && Refresh</button>');
        $("#clearCache").on("click", () => this.cacheManager.clearAll());
      }

      if (userConfig.useVue ?? config.useVue) {
        Controller.loadJs(bp + "app/src/js/lib/vue.js", "module").then(() => {
          import(bp + "app/services/vueHost.js").then(({ default: VueHost }) => {
            app.singletons["vue"] = new VueHost();
          });
        });
      }

      //app.runSingletons();
      //app.setLoader();
    });
  }

  setLoader() {
      // Show loader on any AJAX start
    $(document).ajaxStart(function() {
      $("#loader").show();
    });

    // Hide loader when all AJAX requests complete
    $(document).ajaxStop(function() {
      $("#loader").hide();
    });
  }

  /**
   * Registers the Service Worker and returns a promise that resolves 
   * only when the Service Worker is fully 'active' and controlling the page.
   * This ensures the 'navigator.serviceWorker.controller' is available 
   * when the application needs to send messages or use fetch.
   * * NOTE: The SW file is now assumed to be located at the application's root: '/sw.js'.
   */
  startServiceWorker() {
    return new Promise((resolve, reject) => {
      // UPDATED PATH: Assumes sw.js is at the root of the application for maximum scope.
      const swPath = 'sw.js';
      
      if (!('serviceWorker' in navigator)) {
          console.warn('Service Workers are not supported by this browser.');
          return resolve(false);
      }

      // 1. Start Registration
      // The scope: '/' ensures the Service Worker attempts to control the entire domain.
      navigator.serviceWorker.register(swPath, { scope: '/' })
        .then(registration => {
          console.log('Service Worker registration successful:', registration.scope);

          // 2. Wait for the Service Worker to become 'active'
          if (registration.active) {
            // If already active (e.g., on subsequent loads), resolve immediately
            return resolve(true);
          }
          
          // Handle cases where installation fails or the worker is null
          if (!registration.installing) {
              console.warn('Service Worker found but not installing. Assuming controlled state.');
              return resolve(true);
          }

          // 3. For new installations, wait for the state to change to 'activated'
          registration.installing.addEventListener('statechange', function(event) {
            if (event.target.state === 'activated') {
              console.log('Service Worker state changed to activated.');
              
              // Wait a fraction of a second to ensure claim() has settled
              setTimeout(() => {
                  resolve(true);
              }, 100); 
            }
          });

        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
          reject(error);
        });
    });
  }


}

// Example of registering actions
let app = new App();
// app.actionRegistry.registerAction('test');
app.actionRegistry.registerAction('table');

app.init();
