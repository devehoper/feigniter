class ErrorHandler {
    // Log an error message and optionally an error object
    static logError(message, error = null) {
        console.error(`Error: ${message}`);
        if (error) {
            console.error(error);
        }
        if (app && app.log) {
            app.log(error); // Log error using the app's logging mechanism
        }
        if (config.debugMode) {
            this.showNotification(error.message || "An error occurred."); // Show notification in debug mode
        }
    }

    // Display an error notification on the screen
    static showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "error-notification";
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000); // Auto-remove after 5 seconds
    }
}