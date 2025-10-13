# Feigniter

**A lightweight, MVC-inspired frontend micro-framework built on jQuery.**

Feigniter brings structure and modern development patterns to jQuery-based projects, making it ideal for "micro-websites" and single-page applications where a larger framework like React or Vue would be overkill.

It combines the simplicity and familiarity of jQuery with the organized, maintainable structure of a Model-View-Controller (MVC) architecture.

---

## Table of Contents

- [Feigniter](#feigniter)
  - [Table of Contents](#table-of-contents)
  - [Philosophy](#philosophy)
  - [Core Concepts](#core-concepts)
    - [Routing](#routing)
    - [Controllers](#controllers)
    - [Views](#views)
    - [Models \& Validation](#models--validation)
    - [Configuration](#configuration)
  - [Key Features](#key-features)
  - [File Structure](#file-structure)
  - [Getting Started](#getting-started)
  - [Development Workflow](#development-workflow)
    - [Scaffolding](#scaffolding)
    - [Testing](#testing)
  - [Going to Production](#going-to-production)

---

## Philosophy

The goal of Feigniter is to provide a structured, convention-over-configuration environment for frontend development without the steep learning curve or heavy dependencies of modern JavaScript frameworks.

- **Low Barrier to Entry:** If you know jQuery, you're ready to use Feigniter.
- **Structured & Organized:** Enforces a clean MVC pattern to prevent "spaghetti code."
- **Lightweight:** No complex build tools or transpilers are required for development. It's just HTML, CSS, and JavaScript.
- **Feature-Rich:** Includes routing, translation, validation, and caching out of the box.

---

## Core Concepts

Feigniter's architecture will be familiar to anyone who has worked with an MVC framework.

### Routing

The framework uses a simple, hash-based routing system to navigate between pages and trigger controller methods. The URL structure is as follows:

```
#ControllerName?methodName=arg1,arg2,...
```

**Examples:**

- `index.html#HomeController?index`
  - This will load `HomeController.js` and execute its `index()` method.

- `index.html#UserController?showProfile=123`
  - This will load `UserController.js`, execute the `showProfile()` method, and pass `123` as an argument.

The application's entry point is defined in `userConfig.js` via the `homeController` and `defaultMethod` properties.

### Controllers

Controllers are the "brains" of your application. They handle user input, manage application logic, and decide which view to render. Each controller is a JavaScript class that extends the base `Controller`.

**Example `app/controller/MyPageController.js`:**

```javascript
export default class MyPageController extends Controller {
    index() {
        // The index method is the default entry point for a controller.
        // It loads the corresponding view into the main app container.
        this.loadView('app/view/mypage.html');
    }

    about() {
        // This method would be triggered by the URL: #MyPageController?about
        this.loadView('app/view/about.html');
    }
}
```

### Views

Views are the "face" of your application. They are simple HTML files containing the structure and content of a page. Views are loaded and rendered by controllers.

**Example `app/view/mypage.html`:**

```html
<div class="container py-5">
    <h1>Welcome to My Page!</h1>
    <p>This content is loaded from a view file.</p>
</div>
```

### Models & Validation

While Feigniter doesn't enforce a strict data-layer Model, it provides a powerful `Model` utility class primarily for **data validation**. This allows you to define rules and validate data objects before processing them (e.g., before an API call).

The `Model.validateData(data, rules)` method is a static function that checks an object against a set of predefined rules.

**Example (in a Controller):**

```javascript
const userData = {
    email: "not-an-email",
    age: 15
};

const rules = {
    email: { required: true, email: true },
    age: { required: true, min: 18 }
};

const errors = Model.validateData(userData, rules);

if (Object.keys(errors).length > 0) {
    // errors will be:
    // {
    //   email: "Invalid email format",
    //   age: "age must be at least 18"
    // }
    Model.displayValidationErrors(errors); // Helper to show errors
}
```

### Configuration

Feigniter uses a simple and safe configuration system.

- **`app/kernel/config.js`**: This file contains all the default framework settings. **You should never modify this file.**
- **`app/userConfig.js`**: This is where you override the defaults. Any setting you define here will take precedence over the default `config.js`. This makes updates to the framework core safe and easy.

**Example `app/userConfig.js`:**

```javascript
const userConfig = {
    homeController: "MyCoolHomeController", // Sets the default controller
    debugMode: true, // Enables console logs and error messages
    useCache: false // Disables view/asset caching for development
};
```

---

## Key Features

- **Translation:** Built-in support for multiple languages using `i18next`. Language files are stored as JSON in `app/locales/`.
- **View Caching:** To improve performance, Feigniter caches view files after their first load. This can be disabled for development in `userConfig.js`.
- **Centralized Error Handling:** A global error handler catches and logs issues, with detailed output in debug mode.
- **DOM Action System:** Execute JavaScript functions on elements declaratively using the `data-feigniter-action-type` attribute.

---

## File Structure

Feigniter enforces a clean and predictable directory structure to keep your project organized.

```
feigniter/
├── app/
│   ├── controller/   (Your controller classes)
│   ├── kernel/       (The core framework files)
│   ├── locales/      (Translation files, e.g., en.json)
│   ├── model/        (Your model classes)
│   ├── src/          (CSS, JS, images, and other assets)
│   └── view/         (Your HTML view files)
├── index.html        (The main entry point for the application)
└── README.md         (This file)
```

---

## Getting Started

1.  Clone or download the Feigniter repository.
2.  Open the `index.html` file in your browser.
3.  Start building! Modify `app/userConfig.js` to set your default controller and begin creating your own controllers, models, and views.

---

## Development Workflow

### Scaffolding

Feigniter includes helpful npm scripts to quickly create new files and maintain a consistent structure.

```bash
# Create a new controller
npm run new:controller --name=MyController

# Create a new model
npm run new:model --name=MyModel

# Create a new view
npm run new:view --name=my-view
```

### Testing

The project is set up with Jest for unit testing. You can run all tests from the command line:

```bash
npm test
```

---

## Going to Production

Before deploying your website, make sure to configure it for production for the best performance and security.

In your **`app/userConfig.js`** file, set the following:

```javascript
const userConfig = {
    debugMode: false, // Disables verbose console errors
    useCache: true    // Enables view and asset caching
};
```

It is also recommended to minify your JavaScript and CSS assets for a production environment.

---