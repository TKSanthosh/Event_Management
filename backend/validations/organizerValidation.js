const { body } = require('express-validator');

const organizerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone')
    .matches(/^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/)
    .withMessage('Valid phone number is required (e.g. +91 98765 43210)'),
  body('organizationName')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required'),
];

module.exports = { organizerValidation };
