const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');
const venueService = require('../services/venueService');

const getVenues = asyncHandler(async (req, res) => {
  const venues = await venueService.getAllVenues();
  sendResponse(res, 200, 'Venues retrieved', venues);
});

const getVenue = asyncHandler(async (req, res) => {
  const venue = await venueService.getVenueById(req.params.id);
  sendResponse(res, 200, 'Venue retrieved', venue);
});

const createVenue = asyncHandler(async (req, res) => {
  const venue = await venueService.createVenue(req.body);
  sendResponse(res, 201, 'Venue created', venue);
});

const updateVenue = asyncHandler(async (req, res) => {
  const venue = await venueService.updateVenue(req.params.id, req.body);
  sendResponse(res, 200, 'Venue updated', venue);
});

const deleteVenue = asyncHandler(async (req, res) => {
  await venueService.deleteVenue(req.params.id);
  sendResponse(res, 200, 'Venue deleted');
});

module.exports = { getVenues, getVenue, createVenue, updateVenue, deleteVenue };
