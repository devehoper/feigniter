# License
####
MIT

#####

# About
**
Feigniter its meant to simplify the front-end development, using mvc pattern and avoid dependencies issues.
By default Feigniter uses Jquery, Jquery UI, bootstrap 5.3, fontawesome, DataTables 2.2.2, i18next
**

# Mission
**
Keep it simple, clean and easy to use boosting development speed.
**

# Why and when to use this lib?
**
1. Avoid dependencies
2. Simple to use
3. Its open source, everyone can contribute to improve this lib
4. Ideal for micro websites
5. Also can be used in more complex websites if functionalities are separated in subdomains
6. If you're planing a big website that contains lots of content, you should use reactjs or vue.js
**

# How to use

#### File names
**
Controller name should be NameController and file name NameController.js
Model name should be NameModel and file name NameModel.js
**

#### Routing system
**
The route will define the behavior of the app.
base_path#controllerName?MethodName=arg1,arg2,arg3
**

#### Views dir app/view
**
Contains the app views
Add the needed javascript for the view in the directory app/src/js/...
**

#### Controllers app/controller
Each controller should extend Controller and should add export default before the "class"
Example:
export default class HomeController extends Controller{...}

#### Models app/model
AppModel.js handles the app state, change it according to your needs but don't remove what's already there;
Example:
class UserModel extends Model{...}
app.models.UserModel = new UserModel();

#### DOM actions
**
data-feigniter-type="actionName"
**

#### NOTE.: Dom Events
**
Since the views are being added later in the DOM, according to user navigation,
in controller to access the DOM must use this notation:
**
```
$(document).on('click', '#elementId', function() {
    alert('clicked');
});
``

#### Styling
**
Directory "app/src/scss":
This dir contains the scss needed files.
variables.scss its where we define the needed vars and set wich theme to compile
effects.scss contains animations to use

Directory "app/src/css":
This dir  its the output dir for scss

**

#### @TODO
**

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

**