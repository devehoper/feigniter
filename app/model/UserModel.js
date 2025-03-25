class UserModel extends Model {
    email = "";
    loginToken = "";
    name ="";
    constructor() {
        super();
  
    }
}

app.models.UserModel = new UserModel();