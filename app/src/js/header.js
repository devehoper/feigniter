class Header {
    //Runs once
    constructor() {
        
        this.setEvents();
    }

    //Runs on every page load
    update ()  {

    }

    setEvents() {
        $(document).ready(() => {
            // Handle language change
            $(document).on('change', '#language-selector, #language-selector-mobile', (e) => {
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
                } else {
                }
            });

            //Initialize theme selector
            let themeSelected = app.data.theme;
            app.setTheme(themeSelected); // Set the theme on page load

            // Handle theme change
            $(document).on('change', '#theme-selector, #theme-selector-mobile', (e) => {
                const selectedTheme = $(e.target).val();
                if(selectedTheme !== "default") {
                    app.setTheme(selectedTheme);
                }
            });

            $(document).on('click', '.btn-signin', (e) => {
                openGenericModal({
                    title: 'User Sign In',
                    localView: 'app/view/home/signin.html',
                    size: 'lg'
                });
            });

            $(document).on('click', '.frm-sign-in', (e) => {
                e.preventDefault();
                this.login();

            });

        });
    }

    login() {
        const formData = {
            email: $("#signinEmail").val(),
            password: $("#signinPassword").val(),
        };

        const rules = {
            email: { required: true, email: true },
            password: { required: true, passwordStrength: true },
        };

        const errors = Model.validateData(formData, rules);
        if (Object.keys(errors).length > 0) {
            app.log(errors);
            Model.displayValidationErrors(errors);
        } else {
            app.log("Form is valid! ✅");
        }
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