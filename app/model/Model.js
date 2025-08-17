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
            if(typeof data === "undefined" || data !== null) {
                for(let key in data) {
                    storage[key] = data[key];
                }
                localStorage.setItem(config.localStorage, JSON.stringify(storage));
            }
        } catch (error) {
            console.error("Error setting local data:", error);
        }
    }

    static getLocalData() {
        try {
            let data = localStorage.getItem(config.localStorage) === null
                ? {}
                : JSON.parse(localStorage.getItem(config.localStorage));
            return data;
        } catch (error) {
            console.error("Error getting local data:", error);
            return null;
        }
    }

    static clearLocalData() {
        try {
            localStorage.removeItem(config.localStorage);
        } catch (error) {
            console.error("Error clearing local data:", error);
        }
    }

    static validateData(formData, rules) {
        const errors = {};
    
        for (const field in rules) {
            const value = formData[field];
            const fieldRules = rules[field];
    
            for (const rule in fieldRules) {
                const ruleValue = fieldRules[rule];
    
                switch (rule) {
                    case "required":
                        if (!value || (typeof value === "string" && value.trim() === "")) {
                            errors[field] = `${field} is required`;
                        }
                        break;
    
                    case "minLength":
                        if (value.length < ruleValue) {
                            errors[field] = `${field} must be at least ${ruleValue} characters`;
                        }
                        break;
    
                    case "maxLength":
                        if (value.length > ruleValue) {
                            errors[field] = `${field} must be at most ${ruleValue} characters`;
                        }
                        break;
    
                    case "email":
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(value)) {
                            errors[field] = "Invalid email format";
                        }
                        break;
    
                    case "number":
                        if (isNaN(value)) {
                            errors[field] = `${field} must be a number`;
                        }
                        break;
    
                    case "min":
                        if (Number(value) < ruleValue) {
                            errors[field] = `${field} must be at least ${ruleValue}`;
                        }
                        break;
    
                    case "max":
                        if (Number(value) > ruleValue) {
                            errors[field] = `${field} must be at most ${ruleValue}`;
                        }
                        break;
    
                    case "passwordStrength":
                        const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
                        if (!strongPasswordPattern.test(value)) {
                            errors[field] = "Password must be at least 6 characters with at least 1 letter and 1 number";
                        }
                        break;
    
                    case "checked":
                        if (!value) {
                            errors[field] = `${field} must be checked`;
                        }
                        break;
    
                    case "file":
                        if (!value || value.length === 0) {
                            errors[field] = `Please upload a file`;
                            break;
                        }
                        
                        const file = value[0]; // Get the first file (assuming single file input)
                        
                        if (fieldRules.allowedTypes && !fieldRules.allowedTypes.includes(file.type)) {
                            errors[field] = `Invalid file type. Allowed types: ${fieldRules.allowedTypes.join(", ")}`;
                        }
    
                        if (fieldRules.maxSize && file.size > ruleValue * 1024) {
                            errors[field] = `${field} must be less than ${ruleValue} KB`;
                        }
    
                        if (fieldRules.minSize && file.size < ruleValue * 1024) {
                            errors[field] = `${field} must be at least ${ruleValue} KB`;
                        }
                        break;
    
                    case "custom":
                        if (typeof ruleValue === "function" && !ruleValue(value)) {
                            errors[field] = `${field} is invalid`;
                        }
                        break;
                }
            }
        }
    
        return errors;
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
    //     console.log("Validation errors:", errors);
    // } else {
    //     console.log("Form is valid! ✅");
    // }    
    
    toJson() {
        
    }
}