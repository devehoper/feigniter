describe("App Class", () => {
  let app;

  beforeEach(() => {
    // A new App instance is created before each test.
    // The App class is available globally from setupTests.js
    app = new App();
  });

  test("should initialize with default values", () => {
    expect(app.controller).toBe(config.homeController);
    expect(app.method).toBe(config.defaultMethod);
    expect(app.args).toEqual([]);
  });
  
  test("should parse URL correctly", () => {
    const url = "#TestController?testMethod=arg1,arg2";
    const result = app.parseURL(url);
    expect(result.controller).toBe("TestController");
    expect(result.method).toBe("testMethod");
    expect(result.args).toEqual(["arg1", "arg2"]);
  });
});
