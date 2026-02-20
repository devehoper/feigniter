class UserModel extends Model {
  api = {
    login: userConfig.backendPath + "login",
    register: userConfig.backendPath + "register",
    // logout: config.backendPath + "auth/logout",
    // profile: config.backendPath + "auth/profile",
  };

  email = null;
  loginToken = null;
  name = null;

  constructor(name, email) {
    super();
    this.name = name || "";
    this.email = email || "";
  }

  // validateResponse(actual, expected) {
  //   function deepCompare(obj, template) {
  //     if (typeof template === "string") {
  //       return typeof obj === template;
  //     }

  //     if (typeof template === "object" && template !== null) {
  //       for (let key in template) {
  //         if (!(key in obj)) return false;
  //         if (!deepCompare(obj[key], template[key])) return false;
  //       }
  //       return true;
  //     }

  //     return false;
  //   }

  //   return deepCompare(actual, expected);
  // }

  toJson() {
    return {
      name: this.name,
      email: this.email,
    };
  }

  fromJson(data) {
    this.name = data?.user?.name || "";
    this.email = data?.user?.email || "";
    this.loginToken = data?.token || "";
  }

  isAuthenticated() {
    return !!this.loginToken;
  }
}

app.models["UserModel"] = new UserModel();

//Usage example
// const userModel = app.models["UserModel"];
// const expectedLoginSuccess = userModel.api.login.success;
// const expectedLoginError = userModel.api.login.error;

// // Simulated API response
// const apiResponse = {
//   token: "abc123",
//   user: {
//     name: "Carlos",
//     email: "carlos@example.com"
//   }
// };

// if (validateResponse(apiResponse, expectedLoginSuccess)) {
//   console.log("✅ Valid login response");
//   userModel.fromJson(apiResponse);
// } else {
//   console.warn("❌ Unexpected login response format");
// }
