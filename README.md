# Feigniter

Feigniter is a lightweight, modern frontend framework designed to simplify web development by following the MVC (Model-View-Controller) pattern and minimizing dependency issues. It provides a clean and simple structure for building fast, modular, and scalable micro-websites and single-page applications.

By default, Feigniter comes bundled with jQuery, jQuery UI, Bootstrap 5.3, Font Awesome, DataTables, and i18next, with all libraries stored locally to ensure version consistency and offline availability.

# Mission

To keep frontend development simple, clean, and easy, boosting development speed without compromising on modern features.

## Why and when to use Feigniter?

-   **Avoid Dependency Hell**: All core libraries are included, reducing conflicts and setup time.
-   **Simplicity**: An intuitive and easy-to-learn structure.
-   **Open Source**: Contribute and help improve the library.
-   **Ideal for Micro-Websites**: Perfect for smaller projects that need structure without the overhead of larger frameworks.
-   **Scalable**: Can be used for more complex sites by separating functionalities into subdomains.
-   **Know When to Choose Alternatives**: For large, content-heavy enterprise applications, consider using frameworks like React or Vue.js.

## Features

-   **MVC Architecture**: A modular design with Controllers, Models, and Views.
-   **Routing**: Simple and powerful hash-based routing system.
-   **Caching**: Built-in caching for views, CSS, and JavaScript to improve performance.
-   **Translation**: Optional multi-language support using `i18next`.
-   **Error Handling**: Centralized error logging and user-friendly notifications.
-   **Build Process**: Includes scripts for code obfuscation for a production-ready build.
-   **CLI Helpers**: `npm` scripts to quickly scaffold new controllers, models, and views.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/feigniter.git
    cd feigniter
    ```

2.  Install development dependencies (for testing and building):
    ```bash
    npm install
    ```

## Development

To start development, open the `index.html` file through a local web server (like XAMPP, WAMP, or VS Code's Live Server) and navigate to your project URL (e.g., `http://localhost/feigniter`).

-   **Run Tests**:
    ```bash
    npm test
    ```

## Production Build

To prepare your application for production, you can obfuscate the JavaScript source code. This will create a secure, minified version of your code in the `app-obfuscated` directory.

-   **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

