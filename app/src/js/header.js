( () => {
$(document).ready(async () => {
    console.log("Header loaded");

    // Handle language change
    $(document).on('change', '#' + config.translationElementId + ', #' + config.translationElementId + '-sm', (e) => {
        e.preventDefault();
        console.warn("LANGUAGE CHANGED");
        app.log("Language changed");
        if($(e.currentTarget).val() !== "-1") {
            app.translate($(e.currentTarget).val());
        }
    });

    // Handle search click
    $(document).on('keyup', '#search', function(e) {
        const searchValue = $(this).val();
        console.warn($(this).val());
        if (searchValue) {
            app.log(`Search value: ${searchValue}`);
        } else {
            app.log('Search input is empty');
        }
    });

    //Initialize theme selector
    let themeSelected = app.models.AppModel.theme;
    $("#theme-selector").empty(); // Clear existing options
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