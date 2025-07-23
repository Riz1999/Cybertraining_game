/**
 * Request validation middleware
 */
const { validationResult } = require('express-validator');

/**
 * Validate request based on validation rules
 * @param {Array} validations - Array of express-validator validation rules
 * @returns {Function} Express middleware
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Return validation errors
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  };
};

module.exports = validate;