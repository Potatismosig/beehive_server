const Joi = require('joi');
exports.validate = function validate(val) {
    const results = [];

    val.forEach((field) => {
        const { type, min, max, required } = field;

        // Find the key of the property to validate
        const propertyToValidateKey = Object.keys(field).find(key => key !== 'type' && key !== 'min' && key !== 'max' && key !== 'required');
        const propertyToValidateValue = field[propertyToValidateKey];

        if (propertyToValidateValue === undefined) {
            const errorMessage = `Property "${propertyToValidateKey}" is undefined`;
            results.push(errorMessage);
            return;
        }

        let fieldSchema = Joi;

        if (type !== undefined) {
            fieldSchema = fieldSchema[type]();
        }

        if (min !== undefined && min !== false) {
            fieldSchema = fieldSchema.min(min);
        }

        if (max !== undefined && max !== false) {
            fieldSchema = fieldSchema.max(max);
        }

        if (required) {
            fieldSchema = fieldSchema.required();
        }

        // Validate the property using the defined schema
        const isValid = fieldSchema.validate(propertyToValidateValue);
        if (isValid.error) {
            const errorMessage = isValid.error.details[0].message.replace('value', `${propertyToValidateKey}`);
            results.push(errorMessage);
        } else {
            results.push("success");
        }
    });

    const error = results.find(result => result !== "success");
    if (error) {
        return error; // If an error message is found, return it
    }

    return results; // Move the 'return results;' statement outside the forEach loop
};