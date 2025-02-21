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
  }
  