class ErrorHandler {
    static logError(error) {
      console.error("Error:", error);
      if (app && app.log) {
        app.log(error);
      }
    }
  }