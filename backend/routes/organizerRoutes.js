const express = require('express');
const {
  getOrganizers,
  getOrganizer,
  createOrganizer,
  updateOrganizer,
  deleteOrganizer,
} = require('../controllers/organizerController');
const { organizerValidation } = require('../validations/organizerValidation');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getOrganizers);
router.post('/', organizerValidation, validate, createOrganizer);
router.get('/:id', getOrganizer);
router.put('/:id', organizerValidation, validate, updateOrganizer);
router.delete('/:id', deleteOrganizer);

module.exports = router;
