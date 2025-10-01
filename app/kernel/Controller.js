class Controller {
  constructor(modelName) {
  }

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
    if (overwrite) {
        $(selector).empty();
    }

    try {
        // Load CSS first
        await Controller.loadCss(cssUrls).catch();

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
        await Controller.loadJs(jsUrls).catch();
        // Remove redundant manual script injection for app.jsToLoad
        app.jsToLoad = [];

    } catch (error) {
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
