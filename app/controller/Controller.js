class Controller {
  constructor(modelName) {
    this.loadModel("AppModel");
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
        await this.loadCss(cssUrls).catch(ErrorHandler.logError);

        // Ensure viewUrls is an array
        const urls = Array.isArray(viewUrls) ? viewUrls : [viewUrls];

        for (let url of urls) {
            url += url.indexOf(".html") === -1 ? ".html" : "";

            // Check cache or fetch view
            const viewContent = app.viewCache[url] && config.useCache
                ? app.viewCache[url]
                : await new Promise((resolve, reject) => {
                    $.get(url, (data) => {
                        if (config.useCache) {
                            app.viewCache[url] = data;
                        }
                        resolve(data);
                    }).fail((jqXHR, textStatus) => {
                        const errorMsg = `Error loading view: ${url} - ${textStatus}`;
                        ErrorHandler.logError(errorMsg);
                        reject(new Error(errorMsg));
                    });
                });

            // Insert content into the DOM
            if (insertAfter && typeof insertAfter === "string") {
                $(insertAfter).after(viewContent);
            } else if (insertBefore && typeof insertBefore === "string") {
                $(insertBefore).before(viewContent);
            } else if (append) {
                $(selector).append(viewContent);
            } else {
                $(selector).html(viewContent);
            }

            // Apply translations if enabled
            if (config.useTranslation) {
                $("#" + config.translationElementId).val(app.models.AppModel.language || config.defaultLanguage);
                app.translate();
            }
        }

        // Load JS after ensuring the view is in the DOM
        await Controller.loadJs(jsUrls).catch(ErrorHandler.logError);

    } catch (error) {
        ErrorHandler.logError(error);
    }
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
          if(config.useTranslation) {
            $("#" + config.translationElementId).val(app.models.AppModel.language || config.defaultLanguage);
            app.translate();
          }
        });
        resolve(); // Resolve the promise once the content is inserted
      } catch (error) {
        reject(error); // Reject the promise if an error occurs
      }
    });
  }
  

  loadCss = (urls) => {
    return new Promise((resolve) => {
      if (!urls) return resolve();
      
      const cssArray = Array.isArray(urls) ? urls : [urls];
      const promises = cssArray.map(url => new Promise((res, rej) => {
        if (app.cssCache[url] && config.useCache) {
          app.log(`CSS already loaded: ${url}`);
          return res();
        }
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => {
          app.cssCache[url] = true;
          res();
        };
        link.onerror = () => {
          ErrorHandler.logError(`Error loading CSS: ${url}`);
          rej(new Error(`Error loading CSS: ${url}`));
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
      const promises = jsArray.map(url => new Promise((res, rej) => {
        if (app.jsCache[url] && config.useCache) {
          app.log(`js already loaded: ${url}`);
          return res();
        }
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
          app.jsCache[url] = true;
          res();
        }
        script.onerror = () => {
          ErrorHandler.logError(`Error loading JS: ${url}`);
          rej(new Error(`Error loading JS: ${url}`));
        };
        document.head.appendChild(script);
      }));
      
      Promise.all(promises).then(resolve).catch(ErrorHandler.logError);
    });
  };

  loadView(viewUrl, cssUrl = null, jsUrl = null, append = true, template = true) {
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

    // Load the content, CSS, and JS
    this.loadViewContent({
        viewUrls: viewUrlResult,
        cssUrls: finalCssUrls,
        jsUrls: finalJsUrls,
        selector: "#feigniter",
        append,
        overwrite: !append
    });
}

  loadModel(modelName) {
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
