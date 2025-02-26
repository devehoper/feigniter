class Controller {
  constructor() {
    console.log(this);
    this.viewCache = {}; // Cache for loaded views
  }

  async loadView(viewUrl, jquerySelector="#feigniter", cssUrl) {
    jquerySelector ?? "#feigniter";
    if (typeof this.viewCache === 'undefined') {
      this.viewCache = {};
    }

    const loadSingleView = (url, selector, append = false) => {
      return new Promise((resolve, reject) => {
        if (this.viewCache[url]) {
          console.log(`Using cached view: ${url}`);
          if (append) {
            $(selector).append(this.viewCache[url]);
          } else {
            $(selector).html(this.viewCache[url]);
          }
          resolve();
        } else {
          $.get(url, (data) => {
            this.viewCache[url] = data;
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
}
