class UserModel extends Model {
    email = "";
    loginToken = "";
    name = "";
    constructor() {
        super();
  
    }
    toJson() {
        return {
            name: this.name,
            email: this.email
        };
    }
}

app.models.UserModel = new UserModel();