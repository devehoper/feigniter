class Action {
    constructor(name) {
      this.name = name;
    }
  
    execute(name, element) {
      this[name](element);
    }

    test(element) {
      $(element).html("some action");
    }

    table(element) {
      new DataTable('#' + element.id);
    }

    setHeaderTheme() {
      config.themes.forEach((theme) => {
          $("#theme-selector").append(`<option value="${theme}">${theme}</option>`);
      });
    }
  }
  