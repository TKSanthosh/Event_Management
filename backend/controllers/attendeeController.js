const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');
const attendeeService = require('../services/attendeeService');

const getAttendees = asyncHandler(async (req, res) => {
  const attendees = await attendeeService.getAllAttendees();
  sendResponse(res, 200, 'Attendees retrieved', attendees);
});

const getAttendee = asyncHandler(async (req, res) => {
  const attendee = await attendeeService.getAttendeeById(req.params.id);
  sendResponse(res, 200, 'Attendee retrieved', attendee);
});

const createAttendee = asyncHandler(async (req, res) => {
  const attendee = await attendeeService.createAttendee(req.body);
  sendResponse(res, 201, 'Attendee created', attendee);
});

const updateAttendee = asyncHandler(async (req, res) => {
  const attendee = await attendeeService.updateAttendee(req.params.id, req.body);
  sendResponse(res, 200, 'Attendee updated', attendee);
});

const deleteAttendee = asyncHandler(async (req, res) => {
  await attendeeService.deleteAttendee(req.params.id);
  sendResponse(res, 200, 'Attendee deleted');
});

const registerForEvent = asyncHandler(async (req, res) => {
  const attendee = await attendeeService.registerForEvent(
    req.params.id,
    req.params.eventId
  );
  sendResponse(res, 200, 'Registered for event successfully', attendee);
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const attendee = await attendeeService.cancelRegistration(
    req.params.id,
    req.params.eventId
  );
  sendResponse(res, 200, 'Registration cancelled', attendee);
});

module.exports = {
  getAttendees,
  getAttendee,
  createAttendee,
  updateAttendee,
  deleteAttendee,
  registerForEvent,
  cancelRegistration,
};
