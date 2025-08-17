class AppModel extends Model {
    //Data for handling app
    name = "Feigniter";
    version = "0.0.1";
    language = config.defaultLanguage;
    termsAndConditions = false;
    theme = config.defaultTheme;

    constructor() {
        super();
        this.data = Model.getLocalData();
        this.setLanguage();
        this.setTheme(this.theme);
    }

    setTheme(theme) {
        let element = $('#feigniter');
        if(config.themes.includes(theme)) {
            this.theme = theme;
            element.removeClass();
            element.addClass(theme); // Set the theme class on the body element
            this.theme = theme; // Update the theme in the data object
            Model.setLocalData({theme: theme});
            //Model.setLocalData(this.toJson()); // Save the updated data to local storage
        } else {
            app.log(`Theme ${theme} is not available.`);
        }
    }

    setLanguage() {
        let navigatorLanguage =  config.defaultLanguage;
        let ln = Model.getLocalData() == null || typeof Model.getLocalData().language == "undefined"
        ? {}
        : Model.getLocalData().language;
        if(config.useTranslation) {
            navigatorLanguage = (config.availableLanguages.includes(navigator.language) || config.availableLanguages.includes(navigator.userLanguage))
            ? navigator.language || navigator.userLanguage : config.defaultLanguage;
            //app.models.AppModel.language = ln || config.defaultLanguage;
            this.language = ln;
            // ? this.language = this.data.language
            // : navigatorLanguage;
        }
    }

    toJson() {
        return {
            name: this.name,
            version: this.version,
            language: this.language,
            termsAndConditions: this.termsAndConditions,
            theme: this.theme,
            //data: this.data
        };
    }
}

app.models.AppModel = new AppModel();