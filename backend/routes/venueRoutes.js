const express = require('express');
const {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
} = require('../controllers/venueController');
const { venueValidation } = require('../validations/venueValidation');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getVenues);
router.post('/', venueValidation, validate, createVenue);
router.get('/:id', getVenue);
router.put('/:id', venueValidation, validate, updateVenue);
router.delete('/:id', deleteVenue);

module.exports = router;
