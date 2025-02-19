class Controller {
  constructor() {
    console.log(this);
    this.viewCache = {}; // Cache for loaded views
  }

  async loadView(viewUrl, jquerySelector) {
    if (typeof this.viewCache === 'undefined') {
      this.viewCache = {};
    }

    const loadSingleView = (url, selector, append = false) => {
      return new Promise((resolve, reject) => {
        if (this.viewCache[url]) {
          console.log(`Using cached view: ${url}`);
          if (typeof selector === 'undefined') {
            if (append) {
              $("#feigniter").append(this.viewCache[url]);
            } else {
              $("#feigniter").html(this.viewCache[url]);
            }
          } else {
            if (append) {
              $(selector).append(this.viewCache[url]);
            } else {
              $(selector).html(this.viewCache[url]);
            }
          }
          resolve();
        } else {
          $.get(url, (data) => {
            this.viewCache[url] = data;
            console.log(`Loaded view: ${url}`);
            if (typeof selector === 'undefined') {
              if (append) {
                $("#feigniter").append(data);
              } else {
                $("#feigniter").html(data);
              }
            } else {
              if (append) {
                $(selector).append(data);
              } else {
                $(selector).html(data);
              }
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

    $("#feigniter").html("");

    if (Array.isArray(viewUrl)) {
      for (const url of viewUrl) {
        await loadSingleView(url, jquerySelector, true);
      }
    } else {
      await loadSingleView(viewUrl, jquerySelector);
    }
  }
}
