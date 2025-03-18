export default class UserModel extends Model {
    constructor(name, email, loginToken) {
        this.email = email;
        this.loginToken = loginToken;
        this.name = name;
    }
}