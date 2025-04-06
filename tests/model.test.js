const { JSDOM } = require("jsdom");

describe("Model Class", () => {
  let Model;

  beforeAll(() => {
    global.localStorage = {
      store: {},
      setItem(key, value) {
        this.store[key] = value;
      },
      getItem(key) {
        return this.store[key] || null;
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };

    // Load the Model class
    Model = require("../app/model/Model.js").Model;
  });

  beforeEach(() => {
    localStorage.clear();
  });

  test("should set and get local data", () => {
    const data = { key: "value" };
    Model.setLocalData(data);
    const result = Model.getLocalData();
    expect(result).toEqual(data);
  });

  test("should clear local data", () => {
    const data = { key: "value" };
    Model.setLocalData(data);
    Model.clearLocalData();
    const result = Model.getLocalData();
    expect(result).toEqual({});
  });

  test("should validate required fields", () => {
    const formData = { username: "" };
    const rules = { username: { required: true } };
    const errors = new Model().validateData(formData, rules);
    expect(errors.username).toBe("username is required");
  });

  test("should validate email format", () => {
    const formData = { email: "invalid-email" };
    const rules = { email: { email: true } };
    const errors = new Model().validateData(formData, rules);
    expect(errors.email).toBe("Invalid email format");
  });
});
