$(document).ready(() => {
    // let themeSelected = app.model.AppModel.theme;
    // config.themes.forEach((theme) => {
    //     if (themeSelected === theme) {
    //         $("#theme-selector").append(`<option value="${theme}" selected>${theme}</option>`);
    //         app.model.AppModel.setTheme(theme); // Set the theme on page load
    //     } else {
    //         app.model.AppModel.setTheme(themeSelected); // Set the theme on page load
    //     }
    //     $("#theme-selector").append(`<option value="${theme}">${theme}</option>`);
    // });
    $(document).on('change', '#' + config.translationElementId, (e) => {
        e.preventDefault();
        app.log("changed language");
        app.translate();
    });
});