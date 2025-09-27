class Footer {
    constructor() {
        console.warn("Footer singleton initialized");
    }

    update ()  {
        console.warn("Footer update method called");
    }
}

app.singletons["footer"] = new Footer();