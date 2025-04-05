class AppModel extends Model {
    //Data for handling app
    language = Model.getLocalData() === null || typeof Model.getLocalData().language === "undefined" ? config.defaultLanguage : Model.getLocalData().language;
    name = "Feigniter";
    version = "0.0.1";
    constructor() {
        super();
    }
    // loadLocalData() {
    //     let data = {};
    //     if(localStorage.getItem("feigniter") !== null) {
    //         data = JSON.parse(localStorage.getItem("feigniter"));
    //         this.name = data.name;
    //         this.version = data.version;
    //     }
    // }

    // setLocalData() {
    //     localStorage.setItem("feigniter", JSON.stringify({name: this.name, version: this.version}));
    // }

    toJson() {
        return {
            version: this.version
        };
    }
}

app.models.AppModel = new AppModel();