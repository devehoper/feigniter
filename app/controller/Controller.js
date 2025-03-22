class Controller {
  constructor(modelName) {
    app.log(this);
    this.viewCache = {}; // Cache for loaded views
    app.cssCache = app.cssCache || {}; // Cache for loaded CSS files
  }

  loadSingleView = (url, selector, { append = false, insertAfter = null, insertBefore = null } = {}) => {
    return new Promise((resolve, reject) => {
      if (this.viewCache[url]) {
        app.log(`Using cached view: ${url}`);
        this.insertContent(selector, this.viewCache[url], append, insertAfter, insertBefore);
        resolve();
      } else {
        $.get(url, (data) => {
          this.viewCache[url] = data;
          app.log(`Loaded view: ${url}`);
          this.insertContent(selector, data, append, insertAfter, insertBefore);
          resolve();
        }).fail((jqXHR, textStatus, errorThrown) => {
          app.log(`Error loading view: ${url}`, textStatus, errorThrown);
          app.log(`Response: ${jqXHR.responseText}`);
          reject(new Error(`Error loading view: ${url}`));
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
      $(selector).html(content); // Changed from .html() to .append() to preserve existing content
    }
  }

  loadCss = (urls) => {
    return new Promise((resolve, reject) => {
      if (!urls) return resolve();
      
      const cssArray = Array.isArray(urls) ? urls : [urls];
      const promises = cssArray.map(url => new Promise((res, rej) => {
        if (app.cssCache[url]) {
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
        link.onerror = () => rej(new Error(`Error loading CSS: ${url}`));
        document.head.appendChild(link);
      }));
      
      Promise.all(promises).then(resolve).catch(reject);
    });
  };

  // Updated to receive a single object as an argument
  async loadView({ viewUrl, selector = "#feigniter", cssUrl = [], append = true, insertAfter = null, insertBefore = null } = {}) {
    $("#feigniter").html("");
    try {
      if (cssUrl) {
        await this.loadCss(cssUrl);
      }
      if (Array.isArray(viewUrl)) {
        for (const url of viewUrl) {
          await this.loadSingleView(url, selector, { append: true, insertAfter, insertBefore });
        }
      } else {
        await this.loadSingleView(viewUrl, selector, { append: true, insertAfter, insertBefore });
      }
    } catch (error) {
      app.log(error);
    }
  }

  loadModel(modelName) {
    return new Promise((resolve, reject) => {
        if (!$.isEmptyObject(app.models)) {
            return resolve(app.models[modelName]); // Class is already loaded
        }

        const script = document.createElement("script");
        script.src = `app/model/${modelName}.js`;
        script.onload = () => {
            // Ensure the class is fully loaded before resolving
            if (app.models[modelName]) {
                resolve(app.models[modelName]); // Return the loaded class
            } else {
                reject(new Error(`Model ${modelName} is not defined after loading`));
            }
        };
        script.onerror = () => reject(new Error(`Failed to load model: ${modelName}`));

        document.head.appendChild(script);
    });
  }
}
