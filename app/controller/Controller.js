class Controller {
  constructor() {
    console.log(this);
  }

  async loadView(viewUrl, jquerySelector="#feigniter", cssUrl) {
    jquerySelector ?? "#feigniter";
    if (typeof app.viewCache === 'undefined') {
      app.viewCache = {};
    }

    const loadSingleView = (url, selector, append = false) => {
      return new Promise((resolve, reject) => {
        if (app.viewCache[url]) {
          console.log(`Using cached view: ${url}`);
          if (append) {
            $(selector).append(app.viewCache[url]);
          } else {
            $(selector).html(app.viewCache[url]);
          }
          resolve();
        } else {
          $.get(url, (data) => {
            app.viewCache[url] = data;
            console.log(`Loaded view: ${url}`);
            if (append) {
              $(selector).append(data);
            } else {
              $(selector).html(data);
            }
            resolve();
          }).fail((jqXHR, textStatus, errorThrown) => {
            console.error(`Error loading view: ${url}`, textStatus, errorThrown);
            console.error(`Response: ${jqXHR.responseText}`);
            reject(new Error(`Error loading view: ${url}`));
          });
        }
      });
    };

    const loadCss = (urls) => {
      return new Promise((resolve, reject) => {
        if (urls) {
          if (!Array.isArray(urls)) {
            urls = [urls];
          }
          const promises = urls.map(url => {
            return new Promise((res, rej) => {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = url;
              link.onload = () => res();
              link.onerror = () => rej(new Error(`Error loading CSS: ${url}`));
              document.head.appendChild(link);
            });
          });
          Promise.all(promises).then(resolve).catch(reject);
        } else {
          resolve();
        }
      });
    };

    $("#feigniter").html("");

    try {
      await loadCss(cssUrl);

      if (Array.isArray(viewUrl)) {
        for (const url of viewUrl) {
          await loadSingleView(url, jquerySelector, true);
        }
      } else {
        await loadSingleView(viewUrl, jquerySelector);
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadModel(modelName) {
    return new Promise((resolve, reject) => {
        try {
            if (app.modelCache[modelName]) {
                return resolve(`${modelName} is already loaded`);
            }

            const script = document.createElement('script');
            modelName += modelName.indexOf(".js") == -1 ? ".js" : "";
            script.src = `app/model/${modelName}`;
            script.type = 'module';
            script.onload = () => {
                app.modelCache[modelName] = true;
                resolve(`${modelName} loaded successfully`);
            };
            script.onerror = () => reject(new Error(`Failed to load model: ${modelName}`));
            document.head.appendChild(script);
        } catch (error) {
            reject(new Error(`Error loading model: ${error.message}`));
        }
    });
}
}
