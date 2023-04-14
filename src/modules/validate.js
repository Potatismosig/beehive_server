const Joi = require('joi');

exports.validate = function validate(val, req, res) {
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

        if (!(propertyToValidateKey in req.body)) {
            // Property is not present in request body, skip validation
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
        const isValid = fieldSchema.validate(req.body[propertyToValidateKey]);
        if (isValid.error) {
            console.log(isValid.error.details[0].message);
            const errorMessage = isValid.error.details[0].message.replace('value', `${propertyToValidateKey}`);
            results.push(errorMessage);
        } else {
            results.push("success");
        }
    });

    // Check for extra properties in the request body
    const extraProperties = Object.keys(req.body).filter(prop => !val.find(field => Object.keys(field).includes(prop)));
    if (extraProperties.length > 0) {
        const errorMessage = `Invalid properties: ${extraProperties.join(', ')}`;
        results.push(errorMessage);
    }

    const error = results.find(result => result !== "success");

    const success = !error;
    if (error) {
        res.status(400).json(error);
        return false;
    }

    return success;
};
