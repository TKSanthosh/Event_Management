const { body } = require('express-validator');
const mongoose = require('mongoose');

const eventValidation = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('date').isISO8601().withMessage('Valid date is required (ISO 8601 format)'),
  body('startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in HH:MM format'),
  body('endTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in HH:MM format')
    .custom((endTime, { req }) => {
      if (req.body.startTime && endTime <= req.body.startTime) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  body('venue')
    .notEmpty()
    .withMessage('Venue is required')
    .custom((v) => mongoose.Types.ObjectId.isValid(v))
    .withMessage('Invalid venue ID'),
  body('organizer')
    .notEmpty()
    .withMessage('Organizer is required')
    .custom((v) => mongoose.Types.ObjectId.isValid(v))
    .withMessage('Invalid organizer ID'),
  body('maxAttendees')
    .isInt({ min: 1 })
    .withMessage('Max attendees must be a positive integer'),
  body('status')
    .optional()
    .isIn(['upcoming', 'completed', 'cancelled'])
    .withMessage('Status must be upcoming, completed, or cancelled'),
];

module.exports = { eventValidation };
