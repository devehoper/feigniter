class Header {
    //Runs once
    constructor() {
        
        this.setEvents();
        this.updateAuthUI();
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

            // When a login is successful, AuthController will trigger this custom event
            $(document).on('login-success', () => {
                this.updateAuthUI();
            });
        });
    }

    updateAuthUI() {
        const userData = Model.getLocalData();
        const isSignedIn = userData && userData.userToken;

        if (isSignedIn) {
            // User is signed in: Show user name and sign out button
            $('.btn-signin').hide();
            $('.nav-item-user').remove(); // Clear previous user info to prevent duplicates
            $('#main-nav .navbar-nav, #mobile-nav .navbar-nav').append(`
                <li class="nav-item nav-item-user dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        ${userData.userName || 'Account'}
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarUserDropdown">
                        <li><a class="dropdown-item btn-signout" href="#">Sign Out</a></li>
                    </ul>
                </li>
            `);
        } else {
            // User is not signed in: Show sign in button
            $('.btn-signin').show();
            $('.nav-item-user').remove();
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