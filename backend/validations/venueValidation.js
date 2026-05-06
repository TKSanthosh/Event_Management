const { body } = require('express-validator');

const venueValidation = [
  body('name').trim().notEmpty().withMessage('Venue name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
];

module.exports = { venueValidation };
