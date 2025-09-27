class Header {
    //Runs once
    constructor() {
        console.warn("Header singleton initialized");
        this.setEvents();
        this.update();
    }

    //Runs on every page load
    update ()  {
        $(document).ready(() => {
            console.warn("Header update method called");
            
        });
    }

    setEvents() {
        $(document).ready(() => {
            // $(document).on('click', '.header-item', (e) => {
            //     e.preventDefault();
            //     let selectedIndex = $(e.currentTarget).data('index');
            //     app["headerMenuItemSelected"] = selectedIndex;
            //     $('.header-item').removeClass('active');
            //     $(e.currentTarget).addClass('active');
            // });

            // Handle language change
            $(document).on('change', '#language-selecto, #language-selector-mobile', (e) => {
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
            $(document).on('change', '#theme-selector, #theme-selector-mobile', (e) => {
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
    }

    setActiveMenuItem(index) {
        $(document).ready(() => {
            let menuIndex = typeof index === 'number' ? index : $(".header-item.active").data('index');
            $('.header-item').removeClass('active');
            $(".header-item")
            .eq(menuIndex)
            .addClass("active");
        } );
    }
}

app.singletons["header"] = new Header();