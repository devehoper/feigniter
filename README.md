# Feigniter

Feigniter is a modern frontend project showcasing best practices, modular design, and performance optimization. It includes features like routing, caching, translation, and error handling.
By default Feigniter uses Jquery, Jquery UI, bootstrap 5.3, fontawesome, DataTables 2.2.2, i18next.
All the above libs are stored local, and will keep strict to its versions.

# Mission

Keep it simple, clean and easy to use boosting development speed.

## Features

- **Routing**: Dynamic routing with support for hash-based navigation.
- **Caching**: Built-in caching for controllers, views, CSS, and JavaScript files.
- **Translation**: Multi-language support using `i18next` (optional).
- **Error Handling**: Centralized error logging and user-friendly notifications.
- **Modular Design**: Organized structure with controllers, models, and views.
- **Build Process**: Code obfuscation for production using `javascript-obfuscator`.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/feigniter.git
   cd feigniter
   ```

2. Install devDependencies, so you can use unity tests and obfuscate code for production environment:
   ```bash
   npm install
   ```

## Development

- Run tests:
  ```bash
  npm test
  ```

- Start development:
  Open the project in your local server (e.g., XAMPP) and navigate to `http://localhost/feigniter`.

## Production Build

- Obfuscate code for production:
  ```bash
  npm run build
  ```
  This will generate an obfuscated version of the code in the `app-obfuscated` directory.

## Configuration

The application is configured via the `app/config.js` file. Key settings include:

- `appName`: Name of the application.
- `homeController`: Default controller.
- `defaultMethod`: Default method.
- `useNavigationBar`: Enable or disable hash-based navigation.
- `useTranslation`: Enable or disable multi-language support.
- `basePath`: Base path for the application.


## File names

Controller name should be NameController and file name NameController.js
Model name should be NameModel and file name NameModel.js


## File Structure

```
feigniter/
├── app/
│   ├── actions/               # Action handlers
│   ├── controller/            # Controllers
│   ├── model/                 # Models
│   ├── src/                   # Static assets (CSS, JS, etc.)
│   ├── config.js              # Application configuration
│   ├── error_handler.js       # Centralized error handling
│   └── app.js                 # Main application logic
├── tests/                     # Unit tests
├── index.html                 # Entry point
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## Key Highlights

- **Error Handling**: Centralized error handling is implemented in `app/error_handler.js`. Errors are logged to the console and displayed as notifications.
- **Routing**: The `App` class in `app/app.js` handles dynamic routing and updates the URL based on the navigation state.
- **Translation**: Multi-language support is powered by `i18next`. Configure available languages in `config.js`.
- **Build Process**: The `npm run build` script uses `javascript-obfuscator` to secure the code for production.

## DevDependencies (Optional, but i strongly recomend you to use them)
Check package.json for more info
- `javascript-obfuscator`: For code obfuscation.
- `jest`: For unit testing.
- `jest-environment-jsdom`: For simulating a browser environment in tests.
- `util`: For polyfilling `TextEncoder` and `TextDecoder`.


## Why and when to use this lib?

1. Avoid dependencies
2. Simple to use
3. Its open source, everyone can contribute to improve this lib
4. Ideal for micro websites
5. Also can be used in more complex websites if functionalities are separated in subdomains
6. If you're planing a big website that contains lots of content, you should use reactjs or vue.js


## Routing system

The route will define the behavior of the app.
base_path#controllerName?MethodName=arg1,arg2,arg3...


## Views dir app/view

Contains the app views
Add the needed javascript for the view in the directory app/src/js/...


## Controllers app/controller
Each controller should extend Controller and should add export default before the "class"
Example:
export default class HomeController extends Controller{...}

## Models app/model
AppModel.js handles the app state, change it according to your needs but don't remove what's already there;
Example:
class UserModel extends Model{...}
app.models.UserModel = new UserModel();

## DOM actions

data-feigniter-type="actionName"


## NOTE.: Dom Events

Since the views are being added later in the DOM, according to user navigation,
in controller to access the DOM must use this notation:

```
$(document).on('click', '#elementId', function() {
    alert('clicked');
});
```

## Styling

Directory "app/src/scss":
This dir contains the scss needed files.
variables.scss its where we define the needed vars and set wich theme to compile
effects.scss contains animations to use

Directory "app/src/css":
This dir  its the output dir for scss


## Available Commands

### General Commands

- **Run Tests**:  
  Run all tests using Jest.  
  ```bash
  npm run test
  ```

- **Build Project**:  
  Obfuscate the JavaScript files for production.  
  ```bash
  npm run build
  ```

### Create New Components

- **Create a New Controller**:  
  Generate a new controller file in the `app/controller` directory.  
  ```bash
  npm run new:controller -- ControllerName
  ```

- **Create a New Model**:  
  Generate a new model file in the `app/model` directory.  
  ```bash
  npm run new:model -- ModelName
  ```

- **Create a New View**:  
  Generate a new view directory and an `index.html` file inside it.  
  ```bash
  npm run new:view -- ViewName
  ```

- **Create a New JavaScript File**:  
  Generate a new JavaScript file in the `app/src/js` directory.  
  ```bash
  npm run new:js -- ScriptName
  ```

- **Create a New SCSS File**:  
  Generate a new SCSS file in the appropriate theme directory.  
  ```bash
  npm run new:scss -- ThemeName
  ```

## Project Structure

```
d:\xampp\htdocs\feigniter
├── index.html
├── app
│   ├── app.js
│   ├── config.js
│   ├── error_handler.js
│   ├── actions
│   │   ├── action.js
│   │   └── action_registry.js
│   ├── controller
│   │   ├── Controller.js
│   │   ├── HomeController.js
│   │   └── TestController.js
│   ├── model
│   │   ├── Model.js
│   │   └── AppModel.js
│   ├── src
│   │   ├── css
│   │   │   ├── lib
│   │   │   │   ├── all.min.css
│   │   │   │   ├── bootstrap.min.css
│   │   │   │   └── jquery-ui.min.css
│   │   │   ├── main.css
│   │   │   └── themes
│   │   │       ├── default
│   │   │       │   ├── default.css
│   │   │       │   ├── pages
│   │   │       │   │   ├── content.css
│   │   │       │   │   └── footer.css
│   │   │       └── dark
│   │   │           ├── dark.css
│   │   │           ├── pages
│   │   │           │   ├── content.css
│   │   │           │   └── footer.css
│   │   ├── js
│   │   │   ├── lib
│   │   │   │   ├── all.min.js
│   │   │   │   ├── bootstrap.min.js
│   │   │   │   ├── dataTables
│   │   │   │   │   ├── datatables.css
│   │   │   │   │   └── datatables.min.js
│   │   │   │   ├── jquery-ui.min.js
│   │   │   │   └── jquery.js
│   │   │   ├── header.js
│   │   │   └── home
│   │   │       └── content.js
│   └── view
│       ├── footer.html
│       └── home
│           ├── about.html
│           ├── compatibility.html
│           ├── content.html
│           ├── documentation.html
│           ├── faq.html
│           └── features.html
```

## @TODO

Documentation:

Create comprehensive documentation with examples, API references, and tutorials. This will make it easier for other developers to adopt your library.
Customizable Themes:

Add support for customizable themes or templates to make it visually appealing and adaptable to different projects.
Component System:

Introduce a component-based architecture (similar to React or Vue) to allow developers to create reusable UI components.
CLI Tool:

Develop a command-line interface (CLI) tool to scaffold projects, generate controllers, and manage configurations.
Plugin System:

Add a plugin system to allow developers to extend the library with custom features.
Performance Optimization:

Optimize the library for performance by lazy-loading resources and minimizing DOM manipulations.
Testing Framework:

Include a testing framework or guidelines for unit testing controllers, models, and actions.
Community Engagement:

Open-source the library on platforms like GitHub and encourage contributions from the developer community.
Cross-Browser Compatibility:

Ensure the library works seamlessly across all major browsers and devices.
Examples and Use Cases:

Provide real-world examples and use cases to demonstrate the library's capabilities.


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Sponsor Me

If you find this project helpful and want to support its development, consider sponsoring me:

[![Sponsor](https://img.shields.io/badge/Sponsor-❤-red)](https://github.com/sponsors/devehoper)