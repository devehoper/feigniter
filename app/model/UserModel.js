class UserModel extends Model {
  api = {
    baseUrl: "https://www.devehoper.com/api/v1/user/",
    login: {
      url: "https://www.devehoper.com/api/v1/user/login",
      success: {
        token: "string",
        user: {
          name: "string",
          email: "string",
        },
      },
      error: {
        message: "Invalid credentials",
        code: 401,
      },
    },
    register: {
      url: "https://www.devehoper.com/api/v1/user/register",
      success: {
        user: {
          name: "string",
          email: "string",
        },
        confirmation: "email_sent",
      },
      error: {
        message: "Email already exists",
        code: 409,
      },
    },
  };

  email = "";
  loginToken = "";
  name = "";

  constructor() {
    super();
  }

  validateResponse(actual, expected) {
    function deepCompare(obj, template) {
      if (typeof template === "string") {
        return typeof obj === template;
      }

      if (typeof template === "object" && template !== null) {
        for (let key in template) {
          if (!(key in obj)) return false;
          if (!deepCompare(obj[key], template[key])) return false;
        }
        return true;
      }

      return false;
    }

    return deepCompare(actual, expected);
  }

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
