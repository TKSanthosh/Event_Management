const express = require('express');
const {
  getAttendees,
  getAttendee,
  createAttendee,
  updateAttendee,
  deleteAttendee,
  registerForEvent,
  cancelRegistration,
} = require('../controllers/attendeeController');
const { attendeeValidation } = require('../validations/attendeeValidation');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAttendees);
router.post('/', attendeeValidation, validate, createAttendee);
router.get('/:id', getAttendee);
router.put('/:id', attendeeValidation, validate, updateAttendee);
router.delete('/:id', deleteAttendee);
router.post('/:id/register/:eventId', registerForEvent);
router.delete('/:id/cancel/:eventId', cancelRegistration);

module.exports = router;
