class Controller {
  constructor(modelName) {
    app.log(this);
    app.cssCache = app.cssCache || {}; // Cache for loaded CSS files
    app.modelCache = app.modelCache || {}; // Cache for loaded models
  }

  loadSingleView = (url, selector, { append = false, insertAfter = null, insertBefore = null } = {}) => {
    return new Promise((resolve, reject) => {
      if (app.viewCache[url]) {
        app.log(`Using cached view: ${url}`);
        this.insertContent(selector, app.viewCache[url], append, insertAfter, insertBefore);
        resolve();
      } else {
        $.get(url, (data) => {
          if(config.useCache) {
            app.viewCache[url] = data;
          }
          app.log(`Loaded view: ${url}`);
          this.insertContent(selector, data, append, insertAfter, insertBefore);
          resolve();
        }).fail((jqXHR, textStatus, errorThrown) => {
          const errorMsg = `Error loading view: ${url} - ${textStatus}`;
          ErrorHandler.logError(errorMsg);
          reject(new Error(errorMsg));
        });
      }
    });
  };

  insertContent(selector, content, append, insertAfter, insertBefore) {
    if (insertAfter && typeof insertAfter === "string") {
      $(insertAfter).after(content);
    } else if (insertBefore && typeof insertBefore === "string") {
      $(insertBefore).before(content);
    } else if (append) {
      $(selector).append(content);
    } else {
      $(selector).html(content);
    }
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

  loadJs = (urls) => {
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

  async loadView({ viewUrl, selector = "#feigniter", cssUrl = [], jsUrl = [],
    append = false, insertAfter = null, insertBefore = null, overwrite = true } = {}) {
    if (overwrite) {
      $(selector).empty();
    }
    try {
      await this.loadCss(cssUrl).catch(ErrorHandler.logError);
      await this.loadJs(jsUrl).catch(ErrorHandler.logError);

      if (Array.isArray(viewUrl)) {
        for (let url of viewUrl) {
          url += url.indexOf(".html") === -1 ? ".html" : "";
          await this.loadSingleView(url, selector, { append: true, insertAfter, insertBefore });
        }
      } else {
        viewUrl += viewUrl.indexOf(".html") === -1 ? ".html" : "";
        await this.loadSingleView(viewUrl, selector, { append: true, insertAfter, insertBefore });
      }
      app.translate();
    } catch (error) {
      ErrorHandler.logError(error);
    }
  }

  loadPage(viewUrl, cssUrl = null, jsUrl = null, insertAfter = false) {
    let resultJs;
    let viewUrlResult = [];

        // if(jsUrl != null) {
    //   if(jsUrl instanceof Array) {
    //     jsArray.append("app/src/js/header.js");
    //     resultJs = jsUrl;
    //   } else {
    //     resultJs = ["app/src/js/header.js", jsUrl];
    //   }
    // } else {
    //   resultJs = ["app/src/js/header.js"]
    // }

    if (viewUrl instanceof Array) {
        viewUrlResult = [...config.loadTemplate]; // Create a shallow copy
        viewUrlResult.splice(config.templateIndexToLoad, 0, ...viewUrl);
    } else {
        viewUrl += viewUrl.indexOf(".html") == -1 ? ".html" : "";
        viewUrlResult = [...config.loadTemplate]; // Create a shallow copy
        viewUrlResult.splice(config.templateIndexToLoad, 0, viewUrl);
    }
    
    this.loadView({
        viewUrl: viewUrlResult,
        cssUrl,
        jsUrl,
        insertAfter
    });
}


  loadModel(modelName) {
    modelName = modelName.indexOf(".js") === -1 ? modelName : modelName.slice(0,modelName.length -3);
    return new Promise((resolve, reject) => {
      if (app.modelCache[modelName]) {
        return resolve(app.modelCache[modelName]);
      }
      const script = document.createElement("script");
      script.src = `app/model/${modelName}.js`;
      script.onload = () => {
        if (app.models[modelName]) {
          app.modelCache[modelName] = app.models[modelName];
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
}
