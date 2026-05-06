const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');
const eventService = require('../services/eventService');

const getEvents = asyncHandler(async (req, res) => {
  const result = await eventService.getAllEvents(req.query);
  sendResponse(res, 200, 'Events retrieved', result);
});

const getEvent = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  sendResponse(res, 200, 'Event retrieved', event);
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  sendResponse(res, 201, 'Event created', event);
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);
  sendResponse(res, 200, 'Event updated', event);
});

const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id);
  sendResponse(res, 200, 'Event deleted');
});

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
