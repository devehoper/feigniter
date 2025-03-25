# About
**
Feigniter its mean to simplify the fron-end development, using mvc pattern and avoid dependencies issues.
By default Feigniter uses Jquery, Jquery UI, bootstrap, fontawesome, DataTables 2.2.2.
**

# Mission
**
Keep it simple and clean
**

# Why use this lib?
**
1. Avoid dependencies
2. Simple to use
3. Its open source, everyone can contribute to improve this lib
4. **

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

#### Views
**
If a view its commun in several pages, Ex (header, footer...),
then its javascript should be setted in that view
**

#### Controllers
Each controller should extend Controller and should add export default before the "class"
Example:
export default class HomeController extends Controller{...}

#### Models
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
$(document).on('click', '#btn-test', function() {
    alert('Button clicked!');
});
``