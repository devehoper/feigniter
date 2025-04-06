const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("App Class", () => {
  let App, config, app;

  beforeAll(() => {
    // Load the HTML file into JSDOM
    const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    const dom = new JSDOM(html);
    global.document = dom.window.document;
    global.window = dom.window;
    global.$ = require("jquery");

    // Mock config
    config = {
      homeController: "HomeController",
      defaultMethod: "index",
      debugMode: true,
      useCache: true,
      useTranslation: false,
    };
    global.config = config;

    // Mock dependencies
    global.ActionRegistry = class {
      registerAction() {}
    };
    global.Model = {
      getLocalData: jest.fn(() => ({})),
    };
    global.ErrorHandler = {
      logError: jest.fn(),
    };

    // Load the App class
    App = require("../app/app.js").App;
  });

  beforeEach(() => {
    app = new App();
  });

  test("should initialize with default values", () => {
    expect(app.controller).toBe(config.homeController);
    expect(app.method).toBe(config.defaultMethod);
    expect(app.args).toEqual([]);
  });

  test("should log messages in debug mode", () => {
    const consoleSpy = jest.spyOn(console, "log");
    app.log("Test message");
    expect(consoleSpy).toHaveBeenCalledWith("Test message");
    consoleSpy.mockRestore();
  });

  test("should parse URL correctly", () => {
    const url = "#TestController?testMethod=arg1,arg2";
    const result = app.parseURL(url);
    expect(result.controller).toBe("TestController");
    expect(result.method).toBe("testMethod");
    expect(result.args).toEqual(["arg1", "arg2"]);
  });

  test("should handle invalid base path gracefully", () => {
    const invalidPath = "invalidPath";
    const sanitizedPath = app.sanitizeBasePath(invalidPath);
    expect(sanitizedPath).toBe(config.basePath);
    expect(ErrorHandler.logError).toHaveBeenCalledWith("Invalid base path.");
  });
});
