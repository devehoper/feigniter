class Controller {
  constructor(modelName) {
  }

/**
 * Utility function to send a command to the active Service Worker
 * to fetch a fresh copy of a URL and update the cache in the background.
 * This implements the "Stale-While-Revalidate via PostMessage" pattern.
 * @param {string} url The URL of the view to re-cache (e.g., '/views/home.html').
 */
requestManualCacheUpdate(url) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            command: 'CACHE_VIEW_UPDATE',
            url: url
        });
        console.log(`[Client] Sent command to Service Worker to update: ${url}`);
    } else {
        console.warn("[Client] Service Worker not active or controlled by client. Cannot send update message.");
    }
}


/**
 * Loads view content using the native fetch() API, relying on the
 * Service Worker (sw.js) to manage cache-first network requests.
 * The manual app.viewCache logic is removed.
 * * NOTE: This requires a Service Worker to be registered and active
 * with a Cache-First strategy to function as an effective cache.
 */
async loadViewContent({
    viewUrls = [],
    selector = userConfig.appContainerSelector ?? config.appContainerSelector,
    cssUrls = [],
    jsUrls = [],
    append = false,
    insertAfter = null,
    insertBefore = null,
    overwrite = true
} = {}) {

    // Manual cache check is removed; caching is now handled by the Service Worker (sw.js).
    const targetElement = $(selector);
    if (overwrite) {
        targetElement.empty();
    }

    try {
        // Load CSS first
        // Assuming Controller.loadCss exists and handles asset loading (which should be non-cached by SW)
        await Controller.loadCss(cssUrls).catch(e => console.error("CSS Load Error:", e));

        // Ensure viewUrls is an array, map to full .html paths
        const urls = (Array.isArray(viewUrls) ? viewUrls : [viewUrls])
            .map(url => url + (url.indexOf(".html") === -1 ? ".html" : ""));

        let batchContent = "";
        for (let url of urls) {
            console.log(`Requesting view: ${url}. Service Worker will decide cache/network.`);

            // --- CORE CHANGE: Using native fetch() ---
            // The Service Worker intercepts this request and handles the cache lookup (Cache-First).
            const response = await fetch(url);

            if (!response.ok) {
                // This captures HTTP errors like 404s
                throw new Error(`HTTP error! status: ${response.status} for ${url}`);
            }

            // Get the HTML content
            const viewContent = await response.text();
            batchContent += viewContent;
        }

        // Insert all content at once
        if (insertAfter && typeof insertAfter === "string") {
            $(insertAfter).after(batchContent);
        } else if (insertBefore && typeof insertBefore === "string") {
            $(insertBefore).before(batchContent);
        } else if (append) {
            targetElement.append(batchContent);
        } else {
            targetElement.html(batchContent);
        }

        // Load JS after ensuring the view is in the DOM
        await Controller.loadJs(jsUrls).catch(e => console.error("JS Load Error:", e));
        app.jsToLoad = [];

        // Call the function to trigger a background cache update for the primary view (urls[0]).
        // This updates the cached copy for the user's *next* visit without slowing down the *current* load.
        this.requestManualCacheUpdate(urls[0]); 

    } catch (error) {
        console.error("View Loading Failed:", error.message);
        // Fallback message using jQuery
        targetElement.html(`<div class="p-4 bg-red-100 text-red-700 rounded-lg">Failed to load content: ${error.message}</div>`);
    }
    app.translate();
}



  insertContent(selector, content, append, insertAfter, insertBefore) {
    return new Promise((resolve, reject) => {
      try {
        $(document).ready(() => {
          if (insertAfter && typeof insertAfter === "string") {
            $(insertAfter).after(content);
          } else if (insertBefore && typeof insertBefore === "string") {
            $(insertBefore).before(content);
          } else if (append) {
            $(selector).append(content);
          } else {
            $(selector).html(content);
          }
        });
        resolve().then(() => {
          if(userConfig.useTranslation ?? config.useTranslation) {
            app.translate(app.data.language);
          }
        }); // Resolve the promise once the content is inserted
      } catch (error) {
        reject(error); // Reject the promise if an error occurs
      }
    });
  }

  /**
   * @description Unloads all CSS files related to themes.
   */
  static unloadCSS() {
    const links = document.querySelectorAll(`link[rel="stylesheet"]`);
    links.forEach(link => {
      if(link.attributes["href"].value.indexOf("app/src/css/themes/") != -1) {
        //link.parentNode.removeChild(link);
        link.remove();
      }
    });
  }

static loadCss = (urls, options = {}) => {
  return new Promise((resolve) => {
    let debugMode = userConfig.debugMode ?? config.debugMode;
    let userCache = userConfig.useCache ?? config.useCache;
    if (!urls) return resolve();

    const cssArray = Array.isArray(urls) ? urls : [urls];
    const version = options.version || Date.now(); // Use a timestamp or a passed-in version

    const promises = cssArray.map(url => new Promise((res, rej) => {
      const cacheBustedUrl = debugMode && ! userCache ? url : `${url}?v=${version}`;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cacheBustedUrl;
      link.onload = () => {
        app.cssCache[cacheBustedUrl] = true;
        res();
      };
      link.onerror = () => {
        rej(new Error(`Error loading CSS: ${cacheBustedUrl}`));
      };
      document.head.appendChild(link);
    }));

    Promise.all(promises).then(resolve).catch();
  });
};


  // this one its static because its used in the app.js file
static loadJs = (entries, defaultType = 'text/javascript') => {
  return new Promise((resolve) => {
    if (!entries) return resolve();

    const jsArray = Array.isArray(entries) ? entries : [entries];

    const promises = jsArray.map(entry => {
      const url = typeof entry === 'string' ? entry : entry.url;
      const type = typeof entry === 'string' ? defaultType : (entry.type || defaultType);

      if (app.jsCache[url] === true) {
        return Promise.resolve();
      }

      if (app.jsCache[url] && app.jsCache[url].then) {
        return app.jsCache[url];
      }

      app.jsCache[url] = new Promise((res, rej) => {
        const script = document.createElement('script');
        const cacheBustedUrl = config.debugMode && !config.useCache ? url : url + '?v=' + Date.now();
        const type = typeof entry === 'string' ? defaultType : (entry.type || defaultType);
        script.type = type;
        script.src = cacheBustedUrl;
        script.defer = true;
        script.onload = () => {
          app.jsCache[url] = true;
          res();
        };
        script.onerror = () => {
          app.jsCache[url] = false;
          rej(new Error(`Error loading JS: ${url}`));
        };
        document.body.appendChild(script);
      });

      return app.jsCache[url];
    });

    Promise.all(promises).then(resolve).catch();
  });
};


loadView(viewUrl, cssUrl = null, jsUrl = null, append = true, template = true, selector = (userConfig.appContainerSelector ?? config.appContainerSelector)) {
  return new Promise((resolve, reject) => {
    let viewUrlResult = [];
    let finalCssUrls = [];
    let finalJsUrls = [];
    let defaultViewUrlResult = userConfig.loadTemplate ?? config.loadTemplate;
    let defaultFinalCssUrls = userConfig.loadTemplate ?? config.loadTemplate;
    let defaultFinalJsUrls = userConfig.loadTemplate ?? config.loadTemplate;
    let templateContentInsertIndex = userConfig.templateContentInsertIndex ?? config.templateContentInsertIndex;
    let loadTemplateJs = userConfig.loadTemplate ?? config.loadTemplate;

    try {
      if (template) {
        viewUrlResult = [...defaultViewUrlResult.views];
        finalCssUrls = [...defaultFinalCssUrls.cssUrl];
        finalJsUrls = [...defaultFinalJsUrls.jsUrl];

        const newViews = Array.isArray(viewUrl) ? viewUrl : [viewUrl];
        const formattedViews = newViews.map(url => url + (url.indexOf(".html") === -1 ? ".html" : ""));
        viewUrlResult.splice(templateContentInsertIndex, 0, ...formattedViews);
      } else {
        viewUrlResult = Array.isArray(viewUrl) ? viewUrl : [viewUrl];
        viewUrlResult = viewUrlResult.map(url => url + (url.indexOf(".html") === -1 ? ".html" : ""));
      }

      if (cssUrl) finalCssUrls = finalCssUrls.concat(cssUrl);
      if (jsUrl) finalJsUrls = finalJsUrls.concat(jsUrl);

      if (jsUrl === null || (template && loadTemplateJs.jsUrl.length > 0)) {
        app.jsToLoad = [...loadTemplateJs.jsUrl];
      } else {
        app.jsToLoad = jsUrl instanceof Array ? [...jsUrl] : [jsUrl];
      }
      app.jsToLoad = [...app.jsToLoad, ...finalJsUrls];

      // Wrap loadViewContent in a promise if it’s async
      this.loadViewContent({
        viewUrls: viewUrlResult,
        cssUrls: finalCssUrls,
        jsUrls: finalJsUrls,
        selector,
        append,
        overwrite: !append
      }).then(resolve).catch(reject);
    } catch (err) {
      reject(err);
    }
  });
}


/**
 * 
 * @param {String} modelName
 * @returns {Promise<Model>} Resolves with the loaded model instance
 */
  static async loadModel(modelName) {
    modelName = modelName.indexOf(".js") === -1 ? modelName : modelName.slice(0,modelName.length -3);
    return new Promise((resolve, reject) => {
      if (typeof app.models[modelName] !== 'undefined') {
        return resolve(app.models[modelName]);
      }
      const script = document.createElement("script");
      script.src = `app/model/${modelName}.js`;
      script.onload = () => {
        if (app.models[modelName]) {
          resolve(app.models[modelName]);
        } else {
          const errorMsg = `Model ${modelName} is not defined after loading`;
          (errorMsg);
          reject(new Error(errorMsg));
        }
      };
      script.onerror = () => {
        const errorMsg = `Failed to load model: ${modelName}`;
        (errorMsg);
        reject(new Error(errorMsg));
        window.location.reload();
      };
      document.head.appendChild(script);
    });
  }

  clearViewCache(url) {
    if (app.viewCache[url]) {
      delete app.viewCache[url];
    } else {
    }
  }
}
