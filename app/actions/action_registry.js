class ActionRegistry {
    constructor() {
      this.actions = {};
    }
  
    registerAction(name, handler) {
      this.actions[name] = new Action(name, handler);
    }
  
    executeAction(name, element) {
      if (this.actions[name]) {
        this.actions[name].execute(name, element);

      } else {
        console.error(`Action ${name} not found`);
      }
    }
  }
  