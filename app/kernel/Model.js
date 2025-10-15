class Model {
    constructor() {

    }
/**
 *{data: {data}}
 * @param Object data
 */
    static setLocalData(data) {
        let storage = this.getLocalData();
        try {
            if (data != null) { // Use != null to check for both undefined and null
                for(let key in data) {
                    storage[key] = data[key];
                }
                localStorage.setItem((userConfig.localStorage ?? config.localStorage), JSON.stringify(storage));
            }
        } catch (error) {
            app.error("Error setting local data:", error);
        }
    }

    static getLocalData() {
        try {
            let data = localStorage.getItem((userConfig.localStorage ?? config.localStorage)) === null
                ? {}
                : JSON.parse(localStorage.getItem((userConfig.localStorage ?? config.localStorage)));
            return data;
        } catch (error) {
            app.error("Error getting local data:", error);
            return {}; // Return an empty object on failure to prevent downstream errors
        }
    }

    static clearLocalData() {
        try {
            localStorage.removeItem(userConfig.localStorage ?? config.localStorage);
        } catch (error) {
            app.error("Error clearing local data:", error);
        }
    }

    /**
     * Displays validation errors on a form.
     * Assumes a standard HTML structure where an error element exists with an ID of `[field]-error`.
     * @param {object} errors - The errors object returned from `validateData`.
     * @param {string} [errorClass='invalid-feedback'] - The CSS class for error message elements.
     * @param {string} [idPrefix=''] - A prefix to add to the error element ID selector.
     */
    static displayValidationErrors(errors, errorClass = 'invalid-feedback', idPrefix = '') {
        // First, clear all previous validation messages
        $(`.${errorClass}`).html('').hide();

        for (const field in errors) {
            const errorElement = $(`#${idPrefix}${field}-error`);
            if (errorElement.length) {
                errorElement.html(errors[field]).show();
            }
            else {
                // As a fallback, log an error if the corresponding error element isn't found
                if (typeof app !== 'undefined' && app.warn) {
                    app.warn(`Validation error element not found for field: #${field}-error`);
                }
            }
        }
    }

    // displayValidationErrors(errors, displayMode, errorClass = 'invalid-feedback') {
    //     switch (displayMode.toLowerCase()) {
    //         case 'label':
    //             for (const field in errors) {
    //                 const label = $(`label[for="${field}"]`);
    //                 if (label.length) {
    //                     label.addClass('text-danger');
    //                     label.append(` <span class="${errorClass}">${errors[field]}</span>`);
    //                 }
    //             }
    //             break;
    //         case 'tooltip':
    //             for (const field in errors) {
    //                 const input = $(`#${field}`);
    //                 if (input.length) {
    //                     input.addClass('is-invalid');
    //                     input.attr('title', errors[field]);
    //                 }
    //             }
    //             break;
    //         case 'modal':
    //             let errorMessages = Object.values(errors).join('<br>');
    //             openGenericModal({
    //                 title: 'Validation Error',
    //                 html: `<div class="alert alert-danger">${errorMessages}</div>`,
    //                 size: 'md'
    //             });
    //             break;
    //         default:
    //             this.displayValidationErrors(errors, errorClass);
    //             break;
    //     }
    //     Model.displayValidationErrors(errors, errorClass);
    // }

    static validateData(formData, rules) {
        const errors = {};
    
        for (const field in rules) {
            const fieldRules = rules[field];
    
            for (const ruleName in fieldRules) {
                if (ruleName === 'messages') continue; // Skip the messages object itself
                const ruleValue = fieldRules[ruleName];
                const customMessage = fieldRules.messages?.[ruleName];
    
                switch (ruleName) {
                    case "required":
                        // Use validator.isEmpty which handles various empty cases for strings
                        if (validator.isEmpty(String(formData[field] || ''))) {
                            errors[field] = customMessage || i18next.t('form.error.required', { field });
                        }
                        break;
    
                    case "minLength":
                        if (!validator.isLength(String(formData[field] || ''), { min: ruleValue })) {
                            errors[field] = customMessage || i18next.t('form.error.tooShort', { field, min: ruleValue });
                        }
                        break;
    
                    case "maxLength":
                        if (!validator.isLength(String(formData[field] || ''), { max: ruleValue })) {
                            errors[field] = customMessage || i18next.t('form.error.tooLong', { field, max: ruleValue });
                        }
                        break;
    
                    case "email":
                        if (!validator.isEmail(String(formData[field] || ''))) {
                            errors[field] = customMessage || i18next.t('form.error.invalidEmail', { field });
                        }
                        break;
    
                    case "number":
                        if (!validator.isNumeric(String(formData[field] || ''))) {
                            errors[field] = customMessage || i18next.t('form.error.invalidNumber', { field });
                        }
                        break;
    
                    case "min":
                        if (!validator.isFloat(String(formData[field] || ''), { min: ruleValue })) {
                            errors[field] = customMessage || i18next.t('form.error.min', { field, min: ruleValue });
                        }
                        break;
    
                    case "max":
                        if (!validator.isFloat(String(formData[field] || ''), { max: ruleValue })) {
                            errors[field] = customMessage || i18next.t('form.error.max', { field, max: ruleValue });
                        }
                        break;
    
                    case "passwordStrength":
                        // validator.js has isStrongPassword, but a regex is more flexible here.
                        const pattern = ruleValue instanceof RegExp ? ruleValue : /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
                        if (!String(formData[field] || '').match(pattern)) {
                            errors[field] = customMessage || i18next.t('form.error.weakPassword', { field });
                        }
                        break;
    
                    case "confirmPassword":
                        // ruleValue should be the name of the field to compare with, e.g., 'password'
                        if (formData[field] !== formData[ruleValue]) {
                            errors[field] = customMessage || i18next.t('form.error.passwordMismatch');
                        }
                        break;

                    case "checked":
                        // This rule is specific to form elements, not string values.
                        // It checks for a truthy value (e.g., checkbox is checked).
                        if (!formData[field]) {
                            errors[field] = customMessage || i18next.t('form.error.checked', { field });
                        }
                        break;
    
                    case "file":
                        const fileList = formData[field];
                        if (!fileList || fileList.length === 0) {
                            errors[field] = customMessage || i18next.t('form.error.file.required', { field });
                            break;
                        }
                        
                        // This rule operates on a FileList object, not a string.
                        const file = fileList[0]; // Get the first file (assuming single file input)
                        
                        if (fieldRules.allowedTypes && !fieldRules.allowedTypes.includes(file.type)) {
                            errors[field] = customMessage || i18next.t('form.error.file.invalidType', { field, types: fieldRules.allowedTypes.join(", ") });
                        }
    
                        if (fieldRules.maxSize && file.size > fieldRules.maxSize * 1024) {
                            errors[field] = customMessage || i18next.t('form.error.file.tooLarge', { field, size: fieldRules.maxSize });
                        }
    
                        if (fieldRules.minSize && file.size < fieldRules.minSize * 1024) {
                            errors[field] = customMessage || i18next.t('form.error.file.tooSmall', { field, size: fieldRules.minSize });
                        }
                        break;
    
                    case "custom":
                        if (typeof ruleValue === "function" && !ruleValue(formData[field])) {
                            errors[field] = customMessage || i18next.t('form.error.custom', { field });
                        }
                        break;
                }
                if (errors[field]) break; // Stop validating this field on the first error
            }
        }
    
        return errors;
    }
    
    /**
     * Instance method to validate data against a set of rules.
     * This is a convenience wrapper around the static validateData method,
     * allowing you to call `this.validate()` from within a model instance.
     * @param {object} formData The data to validate.
     * @param {object} rules The validation rules.
     * @returns {object} An object containing validation errors.
     */
    validate(formData, rules) {
        return Model.validateData(formData, rules);
    }
    

    //Example usage:
    // const formData = {
    //     username: "john_doe",
    //     email: "john@example.com",
    //     age: 25,
    //     password: "pass123",
    //     agreeTerms: false
    //profilePicture: document.getElementById("profilePicture").files // Get files from input
    // };
    
    // const rules = {
    //     username: { required: true, minLength: 3, maxLength: 15 },
    //     email: { required: true, email: true },
    //     age: { required: true, number: true, min: 18, max: 99 },
    //     password: { required: true, passwordStrength: true },
    //     agreeTerms: { checked: true },
    //profilePicture: {
    //     required: true,
    //     file: true,
    //     allowedTypes: ["image/png", "image/jpeg", "image/jpg"], // Only images
    //     maxSize: 1024 // Max file size in KB (1MB)
    // }
    // };
    
    // const errors = validateData(formData, rules);
    
    // if (Object.keys(errors).length > 0) {
    //     app.log("Validation errors:", errors);
    // } else {
    //     app.log("Form is valid! ✅");
    // }    
    
    toJson() {
        
    }
}