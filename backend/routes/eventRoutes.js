const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { eventValidation } = require('../validations/eventValidation');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getEvents);
router.post('/', eventValidation, validate, createEvent);
router.get('/:id', getEvent);
router.put('/:id', eventValidation, validate, updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
