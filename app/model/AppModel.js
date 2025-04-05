class AppModel extends Model {
    //Data for handling app
    name = "Feigniter";
    version = "0.0.1";
    language = config.defaultLanguage;
    termsAndConditions = false;

    constructor() {
        super();
        this.data = Model.getLocalData();
        this.setLanguage();
    }

    setLanguage() {
        let navigatorLanguage =  config.defaultLanguage;
        if(config.useTranslation) {
            navigatorLanguage = (config.availableLanguages.includes(navigator.language) || config.availableLanguages.includes(navigator.userLanguage))
            ? navigator.language || navigator.userLanguage : config.defaultLanguage;

            this.language = this.data !== null
            ? this.language = this.data.language
            : navigatorLanguage;
        }
    }

    toJson() {
        return {
            version: this.version
        };
    }
}

app.models.AppModel = new AppModel();