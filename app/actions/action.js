class Action {
    constructor(name, element) {
      this.name = name;
    }
  
    execute(name, element) {
      this[name](element);
    }

    table(element) {
      new DataTable('#' + element.id);
    }
  }
  