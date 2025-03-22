class UserModel extends Model {
    constructor(name, email, loginToken) {
        super();
        this.email = email;
        this.loginToken = loginToken??null;
        this.name = name;
    }

    sayHello() {
        alert("Hello");
    }
}

app.models.UserModel = new UserModel();