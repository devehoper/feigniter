class AppModel extends Model {
    //Data for handling app
    name = "Feigniter";
    version = "0.0.1";
    language = config.defaultLanguage;
    termsAndConditions = false;
    theme = config.defaultTheme;
    data = {};

    constructor() {
        super();
        this.data = Model.getLocalData();
        this.setLanguage();
        //this.setTheme(this.theme);
    }

    setTheme(theme) {
        let element = $('#feigniter');
        if(config.themes.includes(theme)) {
            this.theme = theme;
            element.removeClass();
            element.addClass(theme); // Set the theme class on the body element
            this.data.theme = theme; // Update the theme in the data object
            Model.setLocalData('feigniter', this.data); // Save the updated data to local storage
        } else {
            app.log(`Theme ${theme} is not available.`);
        }
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
            name: this.name,
            version: this.version,
            language: this.language,
            termsAndConditions: this.termsAndConditions,
            theme: this.theme,
            data: this.data
        };
    }
}

app.models.AppModel = new AppModel();