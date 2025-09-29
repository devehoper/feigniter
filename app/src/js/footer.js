class Footer {
    constructor() {
        app.warn("Footer singleton initialized");
    }

    update ()  {
        app.warn("Footer update method called");
    }
}

app.singletons["footer"] = new Footer();