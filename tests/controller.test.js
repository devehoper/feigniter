// --- Mocking Global Dependencies ---
// The complexity of the Controller requires mocking the global environment extensively.
const $ = jest.fn();
$.fn = jest.fn();
$.fn.empty = jest.fn().mockReturnThis();
$.fn.append = jest.fn().mockReturnThis();
$.fn.html = jest.fn().mockReturnThis();
$.fn.after = jest.fn().mockReturnThis();
$.fn.before = jest.fn().mockReturnThis();
$.get = jest.fn(); // Mocking jQuery AJAX
global.$ = $;

const mockApp = {
    log: jest.fn(),
    translate: jest.fn(),
    viewCache: {},
    cssCache: {},
    jsCache: {},
    jsToLoad: [],
    models: {},
    data: { language: 'en' }
};
global.app = mockApp;

const mockConfig = {
    useTranslation: true,
    debugMode: false,
    loadTemplate: {
        views: ['template-header'],
        cssUrl: ['template.css'],
        jsUrl: ['template.js']
    },
    templateContentInsertIndex: 0,
    basePath: '/'
};
global.config = mockConfig;

const mockErrorHandler = {
    logError: jest.fn()
};
global.ErrorHandler = mockErrorHandler;

// Mock DOM manipulation (for Controller.loadJs/loadCss)
const mockAppendChild = jest.fn();
global.document = {
    head: { appendChild: mockAppendChild },
    body: { appendChild: mockAppendChild },
    createElement: (tag) => {
        if (tag === 'link') {
            return { rel: '', href: '', onload: null, onerror: null, remove: jest.fn(), attributes: {} };
        }
        if (tag === 'script') {
            return { type: '', src: '', defer: false, onload: null, onerror: null };
        }
        throw new Error(`Unexpected element creation: ${tag}`);
    },
    querySelectorAll: jest.fn().mockReturnValue([]) // For unloadCSS
};
global.window = {
    location: { reload: jest.fn() }
};

// Import the Controller (assuming it's in a file named Controller.js for standard Jest setup)
// Since we are generating the test in isolation, we must place the class here.

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
    app.log(viewUrls);
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
    //app.translate();
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
      const cacheBustedUrl = config.debugMode ? url : `${url}?v=${version}`;

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
static loadJs = (entries, defaultType = 'text/javascript') => {
  return new Promise((resolve) => {
    if (!entries) return resolve();

    const jsArray = Array.isArray(entries) ? entries : [entries];

    const promises = jsArray.map(entry => {
      const url = typeof entry === 'string' ? entry : entry.url;
      const type = typeof entry === 'string' ? defaultType : (entry.type || defaultType);

      if (app.jsCache[url] === true) {
        app.log(`[jsCache] Already loaded: ${url}`);
        return Promise.resolve();
      }

      if (app.jsCache[url] && app.jsCache[url].then) {
        app.log(`[jsCache] Already loading: ${url}`);
        return app.jsCache[url];
      }

      app.log(`[jsCache] Start loading: ${url}`);
      app.jsCache[url] = new Promise((res, rej) => {
        const script = document.createElement('script');
        const cacheBustedUrl = config.debugMode ? url : url + '?v=' + Date.now();
        const type = typeof entry === 'string' ? defaultType : (entry.type || defaultType);
        script.type = type;
        script.src = cacheBustedUrl;
        script.defer = true;
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
  return new Promise((resolve, reject) => {
    let viewUrlResult = [];
    let finalCssUrls = [];
    let finalJsUrls = [];

    try {
      if (template) {
        viewUrlResult = [...config.loadTemplate.views];
        finalCssUrls = [...config.loadTemplate.cssUrl];
        finalJsUrls = [...config.loadTemplate.jsUrl];

        const newViews = Array.isArray(viewUrl) ? viewUrl : [viewUrl];
        const formattedViews = newViews.map(url => url + (url.indexOf(".html") === -1 ? ".html" : ""));
        viewUrlResult.splice(config.templateContentInsertIndex, 0, ...formattedViews);
      } else {
        viewUrlResult = Array.isArray(viewUrl) ? viewUrl : [viewUrl];
        viewUrlResult = viewUrlResult.map(url => url + (url.indexOf(".html") === -1 ? ".html" : ""));
      }

      if (cssUrl) finalCssUrls = finalCssUrls.concat(cssUrl);
      if (jsUrl) finalJsUrls = finalJsUrls.concat(jsUrl);

      if (jsUrl === null || (template && config.loadTemplate.jsUrl.length > 0)) {
        app.jsToLoad = [...config.loadTemplate.jsUrl];
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
          ErrorHandler.logError(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      script.onerror = () => {
        const errorMsg = `Failed to load model: ${modelName}`;
        ErrorHandler.logError(errorMsg);
        reject(new Error(errorMsg));
        window.location.reload();
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


describe('Controller', () => {
    let controllerInstance;

    beforeAll(() => {
        // Set up mock implementations for static methods called inside loadViewContent
        Controller.loadCss = jest.fn(() => Promise.resolve());
        Controller.loadJs = jest.fn(() => Promise.resolve());
        // Mock jQuery get success callback
        $.get.mockImplementation((url, successCallback) => {
            if (url.includes('error')) {
                // Simulate failure for .fail()
                return { fail: (callback) => { callback(null, 'error'); return { done: jest.fn() }; }, done: jest.fn() };
            }
            // Simulate success for .get()
            successCallback(`Content for ${url}`);
            return { fail: jest.fn(), done: jest.fn() };
        });
    });

    beforeEach(() => {
        controllerInstance = new Controller('TestModel');
        jest.clearAllMocks();
        mockApp.viewCache = {}; // Clear cache before each test
    });

    // --- loadViewContent Tests ---

    describe('loadViewContent', () => {
        const defaultViewUrls = 'home';
        const defaultSelector = '#feigniter';

        test('should empty the target selector if overwrite is true (default)', async () => {
            await controllerInstance.loadViewContent({ viewUrls: defaultViewUrls });
            expect($(defaultSelector).empty).toHaveBeenCalled();
            expect(Controller.loadCss).toHaveBeenCalledWith([]);
            expect(Controller.loadJs).toHaveBeenCalledWith([]);
            expect($(defaultSelector).html).toHaveBeenCalledWith('Content for home.html');
            expect(app.translate).toHaveBeenCalled();
        });

        test('should use view from cache if available', async () => {
            mockApp.viewCache['cached-view.html'] = 'Cached Content';
            await controllerInstance.loadViewContent({ viewUrls: 'cached-view' });

            // Should not call $.get because it's in the cache
            expect($.get).not.toHaveBeenCalled();
            expect($(defaultSelector).html).toHaveBeenCalledWith('Cached Content');
            expect(app.viewCache['cached-view.html']).toBe('Cached Content');
        });

        test('should fetch and cache a new view', async () => {
            await controllerInstance.loadViewContent({ viewUrls: 'new-view' });

            // Should call $.get and populate cache
            expect($.get).toHaveBeenCalledWith('new-view.html', expect.any(Function));
            expect(app.viewCache['new-view.html']).toBe('Content for new-view.html');
            expect($(defaultSelector).html).toHaveBeenCalledWith('Content for new-view.html');
        });

        test('should load multiple views and concatenate content', async () => {
            await controllerInstance.loadViewContent({ viewUrls: ['header', 'footer'] });

            expect($(defaultSelector).html).toHaveBeenCalledWith('Content for header.htmlContent for footer.html');
            expect($.get).toHaveBeenCalledTimes(2);
        });

        test('should use .append() when append option is true', async () => {
            await controllerInstance.loadViewContent({ viewUrls: defaultViewUrls, append: true, overwrite: false });
            expect($(defaultSelector).empty).not.toHaveBeenCalled();
            expect($(defaultSelector).append).toHaveBeenCalledWith('Content for home.html');
            expect($(defaultSelector).html).not.toHaveBeenCalled();
        });

        test('should use .after() when insertAfter is provided', async () => {
            await controllerInstance.loadViewContent({ viewUrls: defaultViewUrls, insertAfter: '.target-element' });
            expect($('.target-element').after).toHaveBeenCalledWith('Content for home.html');
            expect($(defaultSelector).html).not.toHaveBeenCalled();
        });

        test('should use .before() when insertBefore is provided', async () => {
            await controllerInstance.loadViewContent({ viewUrls: defaultViewUrls, insertBefore: '.target-element' });
            expect($('.target-element').before).toHaveBeenCalledWith('Content for home.html');
            expect($(defaultSelector).html).not.toHaveBeenCalled();
        });

        test('should call loadCss and loadJs with provided URLs', async () => {
            const css = ['style.css'];
            const js = ['script.js'];
            await controllerInstance.loadViewContent({ viewUrls: defaultViewUrls, cssUrls: css, jsUrls: js });
            expect(Controller.loadCss).toHaveBeenCalledWith(css);
            expect(Controller.loadJs).toHaveBeenCalledWith(js);
        });

        test('should handle view loading error gracefully', async () => {
            // Mock jQuery fail for a specific URL
            const errorView = 'error-view';
            $.get.mockImplementation((url, successCallback) => {
                if (url.includes(errorView)) {
                    return {
                        fail: (callback) => {
                            // Manually execute the fail callback
                            callback(null, 'error');
                            return { done: jest.fn() };
                        },
                        done: jest.fn()
                    };
                }
                successCallback(`Content for ${url}`);
                return { fail: jest.fn(), done: jest.fn() };
            });

            await controllerInstance.loadViewContent({ viewUrls: errorView });

            expect(mockErrorHandler.logError).toHaveBeenCalledWith(expect.any(Error));
            expect(app.translate).toHaveBeenCalled(); // Should still call translate
            expect($(defaultSelector).html).not.toHaveBeenCalled(); // No content should be inserted
        });
    });

    // --- loadView Tests (Integration with loadViewContent) ---

    describe('loadView', () => {
        test('should correctly combine viewUrls and template views', async () => {
            const viewUrl = 'user-profile';
            await controllerInstance.loadView(viewUrl, null, null, false, true); // template: true

            // viewUrlResult should be ['user-profile.html', 'template-header.html'] (or similar based on splice logic)
            expect(Controller.loadViewContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    viewUrls: [
                        'user-profile.html',
                        'template-header.html'
                    ],
                    cssUrls: ['template.css'],
                    jsUrls: ['template.js'],
                    append: false,
                    overwrite: true
                })
            );
        });

        test('should combine template and custom JS/CSS correctly', async () => {
            const customCss = ['custom.css'];
            const customJs = ['custom.js'];

            await controllerInstance.loadView('content', customCss, customJs, false, true);

            // Expect finalCssUrls to combine template CSS and custom CSS
            expect(Controller.loadViewContent).toHaveBeenCalledWith(
                expect.objectContaining({
                    cssUrls: ['template.css', 'custom.css'],
                    jsUrls: ['template.js', 'custom.js'],
                })
            );
        });
    });

    // --- Static loadCss Tests ---

    describe('static loadCss', () => {
        beforeEach(() => {
            // Reset the loadCss mock to its original complex implementation for isolated testing
            Controller.loadCss.mockRestore();
        });

        test('should resolve immediately if urls is null or empty', async () => {
            await expect(Controller.loadCss(null)).resolves.toBeUndefined();
            expect(mockAppendChild).not.toHaveBeenCalled();
        });

        test('should inject link tag into document.head on success', async () => {
            const urls = ['test.css'];
            const dateNow = Date.now();
            jest.spyOn(global, 'Date').mockImplementation(() => ({ now: () => dateNow }));

            const cssPromise = Controller.loadCss(urls);

            // Verify a link tag was created and appended
            expect(document.head.appendChild).toHaveBeenCalledTimes(1);
            const linkTag = document.head.appendChild.mock.calls[0][0];
            expect(linkTag.rel).toBe('stylesheet');
            expect(linkTag.href).toContain(`test.css?v=${dateNow}`);

            // Manually simulate load event
            linkTag.onload();

            // Check if the promise resolves and cache is updated
            await expect(cssPromise).resolves.toBeUndefined();
            expect(app.cssCache[`test.css?v=${dateNow}`]).toBe(true);
        });

        test('should log error on failure', async () => {
            const urls = ['error.css'];
            const cssPromise = Controller.loadCss(urls);

            // Manually get the created link tag
            const linkTag = document.head.appendChild.mock.calls[0][0];

            // Manually simulate error event
            linkTag.onerror();

            // The Promise.all in loadCss catches the individual promise rejection, so we check for logError
            await cssPromise;
            expect(mockErrorHandler.logError).toHaveBeenCalledWith(expect.any(Array)); // Array because it's called with Promise.all catch
        });
    });
});
