( () => {
$(document).ready(async () => {
    console.log("Header loaded");

    // Handle language change
    $(document).on('change', '#' + config.translationElementId, (e) => {
        e.preventDefault();
        app.log("Language changed");
        app.translate();
    });

    // Handle search click
    $(document).on('input', '#search', function(e) {
        const searchValue = $(this).val();
        if (searchValue) {
            app.log(`Search value: ${searchValue}`);
        } else {
            app.log('Search input is empty');
        }
    });

    //Initialize theme selector
    let themeSelected = app.models.AppModel.theme;
    config.themes.forEach((theme) => {
        $("#theme-selector").append(`<option value="${theme}">${theme}</option>`);
    });
    app.models.AppModel.setTheme(themeSelected); // Set the theme on page load

    // Handle theme change
    $(document).on('change', '#theme-selector', (e) => {
        const selectedTheme = $(e.target).val();
        app.models.AppModel.setTheme(selectedTheme);
        console.log(`Theme changed to: ${selectedTheme}`);
    });
    });
})();