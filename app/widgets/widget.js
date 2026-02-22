class Widget {
    constructor() {
        this.widgetId = "widget-" + Math.random().toString(36).substr(2, 9);
    }
}

class Modal extends Widget {
    constructor(config = {}) {
        super();
        // Any initialization
    }

    open(config) {
        return window.openGenericModal(config);
    }
}

class Spinner extends Widget {
    constructor(config = {}) {
        super();
    }

    show() {
        if ($("#spinner").hasClass("visually-hidden")) {
            window.toggleSpinner();
        }
    }

    hide() {
        if ($("#spinner").hasClass("visually-visible")) {
            window.toggleSpinner();
        }
    }

    toggle() {
        window.toggleSpinner();
    }
}

class Timer extends Widget {
    constructor(config = {}) {
        super();
    }

    start() {
        window.startCountdown();
    }
}

/**
 * WidgetFactory is responsible for creating and managing widget instances.
 * It ensures that only one instance of each widget type is created (singleton pattern).
 */
class WidgetFactory {
    static create(type, config = {}) {
        switch (type.toLowerCase()) {
            case 'modal':
                if(typeof app.widgets['modal'] === "undefined") {
                    app.widgets['modal'] = new Modal(config);
                    $(document).ready(() => {
                        $.get("app/widgets/modal/modal.html", function(data) {
                            $('body').append(data);
                        });
                        Controller.loadCss("app/widgets/modal/modal.css");
                        Controller.loadJs("app/widgets/modal/modal.js");
                    });
                    
                    return app.widgets['modal'];
                } else {
                    return app.widgets['modal'];
                }
            case 'spinner':
                if(typeof app.widgets['spinner'] === "undefined") {
                    app.widgets['spinner'] = new Spinner(config);
                    $(document).ready(() => {
                        $.get("app/widgets/spinner/spinner.html", function(data) {
                            $('body').append(data);
                        });
                        Controller.loadCss("app/widgets/spinner/spinner.css");
                        Controller.loadJs("app/widgets/spinner/spinner.js");
                    });
                } else {
                    return app.widgets['spinner'];
                }
            case 'timer':
                return new Timer(config);
            default:
                throw new Error(`Unknown widget type: ${type}`);
        }
    }
}

// Make WidgetFactory globally available
window.WidgetFactory = WidgetFactory;