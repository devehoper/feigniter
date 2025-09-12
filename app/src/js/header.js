/**
 * Description: Header JS file, autoload annonymous function to avoid polluting global namespace
 */
( () => {
$(document).ready(async () => {
    // Handle language change
    $(document).on('change', '#' + config.translationElementId, (e) => {
        e.preventDefault();
        if($(e.currentTarget).val() !== "default") {
            app.translate($(e.currentTarget).val());
            $(e.currentTarget).val('default');
        }
    });

    // Handle search click
    $(document).on('keyup', '#search', function(e) {
        const searchValue = $(this).val();
        if (searchValue) {
            app.log(`Search value: ${searchValue}`);
        } else {
            app.log('Search input is empty');
        }
    });

    //Initialize theme selector
    let themeSelected = app.data.theme;
    app.models.AppModel.setTheme(themeSelected); // Set the theme on page load

    // Handle theme change
    $(document).on('change', '#theme-selector', (e) => {
        const selectedTheme = $(e.target).val();
        if(selectedTheme !== "default") {
            app.models.AppModel.setTheme(selectedTheme);
            app.setTheme(selectedTheme); // Set the theme in the app
        }
    });

    $(document).on('click', '.btn-signin', (e) => {
        openGenericModal({
            title: 'User Sign In',
            localView: 'app/view/home/signin.html',
            size: 'lg'
        });
    });

});


})();