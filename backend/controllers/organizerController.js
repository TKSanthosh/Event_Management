const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');
const organizerService = require('../services/organizerService');

const getOrganizers = asyncHandler(async (req, res) => {
  const organizers = await organizerService.getAllOrganizers();
  sendResponse(res, 200, 'Organizers retrieved', organizers);
});

const getOrganizer = asyncHandler(async (req, res) => {
  const organizer = await organizerService.getOrganizerById(req.params.id);
  sendResponse(res, 200, 'Organizer retrieved', organizer);
});

const createOrganizer = asyncHandler(async (req, res) => {
  const organizer = await organizerService.createOrganizer(req.body);
  sendResponse(res, 201, 'Organizer created', organizer);
});

const updateOrganizer = asyncHandler(async (req, res) => {
  const organizer = await organizerService.updateOrganizer(req.params.id, req.body);
  sendResponse(res, 200, 'Organizer updated', organizer);
});

const deleteOrganizer = asyncHandler(async (req, res) => {
  await organizerService.deleteOrganizer(req.params.id);
  sendResponse(res, 200, 'Organizer deleted');
});

module.exports = { getOrganizers, getOrganizer, createOrganizer, updateOrganizer, deleteOrganizer };
