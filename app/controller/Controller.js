class Controller {
  constructor(modelName) {
    app.log(this);
  }

  async loadViewContent({ 
    viewUrls = [], 
    selector = "#feigniter", 
    cssUrls = [], 
    jsUrls = [], 
    append = false, 
    insertAfter = null, 
    insertBefore = null, 
    overwrite = true 
  } = {}) {
    if (overwrite) {
        $(selector).empty();
    }

    try {
        // Load CSS first
        await Controller.loadCss(cssUrls).catch(ErrorHandler.logError);

        // Ensure viewUrls is an array
        const urls = Array.isArray(viewUrls) ? viewUrls : [viewUrls];

        // Batch DOM update for multiple views
        let batchContent = "";
        for (let url of urls) {
            url += url.indexOf(".html") === -1 ? ".html" : "";
            // Check cache or fetch view
            let viewContent;
            if (app.viewCache[url]) {
                viewContent = app.viewCache[url];
            } else {
                viewContent = await new Promise((resolve, reject) => {
                    $.get(url, (data) => {
                        app.viewCache[url] = data;
                        resolve(data);
                    }).fail((jqXHR, textStatus) => {
                        const errorMsg = `Error loading view: ${url} - ${textStatus}`;
                        ErrorHandler.logError(errorMsg);
                        reject(new Error(errorMsg));
                    });
                });
            }
            batchContent += viewContent;
        }
        // Insert all content at once
        if (insertAfter && typeof insertAfter === "string") {
            $(insertAfter).after(batchContent);
        } else if (insertBefore && typeof insertBefore === "string") {
            $(insertBefore).before(batchContent);
        } else if (append) {
            $(selector).append(batchContent);
        } else {
            $(selector).html(batchContent);
        }

        // Load JS after ensuring the view is in the DOM
        await Controller.loadJs(jsUrls).catch(ErrorHandler.logError);
        // Remove redundant manual script injection for app.jsToLoad
        app.jsToLoad = [];

    } catch (error) {
        ErrorHandler.logError(error);
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
          if(config.useTranslation) {
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
    if (!urls) return resolve();

    const cssArray = Array.isArray(urls) ? urls : [urls];
    const version = options.version || Date.now(); // Use a timestamp or a passed-in version

    const promises = cssArray.map(url => new Promise((res, rej) => {
      const cacheBustedUrl = `${url}?v=${version}`;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cacheBustedUrl;
      link.onload = () => {
        app.cssCache[cacheBustedUrl] = true;
        res();
      };
      link.onerror = () => {
        ErrorHandler.logError(`Error loading CSS: ${cacheBustedUrl}`);
        rej(new Error(`Error loading CSS: ${cacheBustedUrl}`));
      };
      document.head.appendChild(link);
    }));

    Promise.all(promises).then(resolve).catch(ErrorHandler.logError);
  });
};


  // this one its static because its used in the app.js file
  static loadJs = (urls) => {
    return new Promise((resolve) => {
      if (!urls) return resolve();
      const jsArray = Array.isArray(urls) ? urls : [urls];
      const promises = jsArray.map(url => {
        // If already loaded, resolve immediately
        if (app.jsCache[url] === true) {
          app.log(`[jsCache] Already loaded: ${url}`);
          return Promise.resolve();
        }
        // If loading, return the existing promise
        if (app.jsCache[url] && app.jsCache[url].then) {
          app.log(`[jsCache] Already loading: ${url}`);
          return app.jsCache[url];
        }
        // Otherwise, start loading and cache the promise
        app.log(`[jsCache] Start loading: ${url}`);
        app.jsCache[url] = new Promise((res, rej) => {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url + "?v=" + Date.now(); // Cache busting
          script.onload = () => {
            app.jsCache[url] = true;
            app.log(`[jsCache] Loaded: ${url}`);
            res();
          };
          script.onerror = () => {
            ErrorHandler.logError(`Error loading JS: ${url}`);
            app.jsCache[url] = false;
            rej(new Error(`Error loading JS: ${url}`));
          };
          document.body.appendChild(script);
        });
        return app.jsCache[url];
      });
      Promise.all(promises).then(resolve).catch(ErrorHandler.logError);
    });
  };

  loadView(viewUrl, cssUrl = null, jsUrl = null, append = true, template = true, selector = "#feigniter") {
    let viewUrlResult = [];
    let finalCssUrls = [];
    let finalJsUrls = [];

    if (template) {
        // Include template views, CSS, and JS
        viewUrlResult = [...config.loadTemplate.views];
        finalCssUrls = [...config.loadTemplate.cssUrl];
        finalJsUrls = [...config.loadTemplate.jsUrl];

        // Ensure viewUrl is an array and append it at the specified index
        const newViews = Array.isArray(viewUrl) ? viewUrl : [viewUrl];
        const formattedViews = newViews.map(url => url + (url.indexOf(".html") === -1 ? ".html" : ""));
        viewUrlResult.splice(config.templateContentInsertIndex, 0, ...formattedViews);
    } else {
        // Handle non-template views
        viewUrlResult = Array.isArray(viewUrl) ? viewUrl : [viewUrl];
        viewUrlResult = viewUrlResult.map(url => url + (url.indexOf(".html") === -1 ? ".html" : ""));
    }

    // Combine CSS and JS from both template and method arguments
    if (cssUrl) finalCssUrls = finalCssUrls.concat(cssUrl);
    if (jsUrl) finalJsUrls = finalJsUrls.concat(jsUrl);

    // so in app.handleHashChange() we know wich js files we should run
    // finalJsUrls.map((url) => {
    //   app.jsToLoad[Date.now().toString()] = url; // Add a unique key to the jsToLoad object
    // });

    // Load the content, CSS, and JS
    if (jsUrl === null || (template && config.loadTemplate.jsUrl.length > 0)) {
        app.jsToLoad = [...config.loadTemplate.jsUrl];
    } else {
        app.jsToLoad = jsUrl instanceof Array ? [...jsUrl] : [jsUrl];
    }
    app.jsToLoad = [...app.jsToLoad, ...finalJsUrls]; // Ensure both are included

    this.loadViewContent({
        viewUrls: viewUrlResult,
        cssUrls: finalCssUrls,
        jsUrls: finalJsUrls,
        selector,
        append,
        overwrite: !append
    });
}

  static loadModel(modelName) {
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
          ErrorHandler.logError(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      script.onerror = () => {
        const errorMsg = `Failed to load model: ${modelName}`;
        ErrorHandler.logError(errorMsg);
        reject(new Error(errorMsg));
      };
      document.head.appendChild(script);
    });
  }

  clearViewCache(url) {
    if (app.viewCache[url]) {
      delete app.viewCache[url];
      app.log(`Cleared cache for view: ${url}`);
    } else {
      app.log(`No cache found for view: ${url}`);
    }
  }
}
