const Attendee = require('../models/Attendee');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');

const getAllAttendees = async () =>
  Attendee.find().populate('registeredEvents', 'title date status').sort({ createdAt: -1 });

const getAttendeeById = async (id) => {
  const attendee = await Attendee.findById(id).populate('registeredEvents', 'title date status');
  if (!attendee) throw new AppError('Attendee not found', 404);
  return attendee;
};

const createAttendee = async (data) => Attendee.create(data);

const updateAttendee = async (id, data) => {
  const attendee = await Attendee.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!attendee) throw new AppError('Attendee not found', 404);
  return attendee;
};

const deleteAttendee = async (id) => {
  const attendee = await Attendee.findById(id);
  if (!attendee) throw new AppError('Attendee not found', 404);

  await Event.updateMany(
    { attendees: id },
    { $pull: { attendees: id }, $inc: { attendeesCount: -1 } }
  );

  await attendee.deleteOne();
};

const registerForEvent = async (attendeeId, eventId) => {
  const attendee = await Attendee.findById(attendeeId);
  if (!attendee) throw new AppError('Attendee not found', 404);

  const event = await Event.findById(eventId);
  if (!event) throw new AppError('Event not found', 404);

  if (event.status === 'cancelled') {
    throw new AppError('Cannot register for a cancelled event', 400);
  }

  if (event.attendeesCount >= event.maxAttendees) {
    throw new AppError('Event has reached maximum capacity', 400);
  }

  if (attendee.registeredEvents.includes(eventId)) {
    throw new AppError('Attendee is already registered for this event', 409);
  }

  // both documents need to stay in sync — attendee holds list of events, event holds list of attendees
  attendee.registeredEvents.push(eventId);
  await attendee.save();

  event.attendees.push(attendeeId);
  event.attendeesCount += 1;
  await event.save();

  return attendee.populate('registeredEvents', 'title date status');
};

const cancelRegistration = async (attendeeId, eventId) => {
  const attendee = await Attendee.findById(attendeeId);
  if (!attendee) throw new AppError('Attendee not found', 404);

  const event = await Event.findById(eventId);
  if (!event) throw new AppError('Event not found', 404);

  if (!attendee.registeredEvents.includes(eventId)) {
    throw new AppError('Attendee is not registered for this event', 400);
  }

  attendee.registeredEvents = attendee.registeredEvents.filter(
    (id) => id.toString() !== eventId
  );
  await attendee.save();

  event.attendees = event.attendees.filter((id) => id.toString() !== attendeeId);
  event.attendeesCount = Math.max(0, event.attendeesCount - 1);
  await event.save();

  return attendee.populate('registeredEvents', 'title date status');
};

module.exports = {
  getAllAttendees,
  getAttendeeById,
  createAttendee,
  updateAttendee,
  deleteAttendee,
  registerForEvent,
  cancelRegistration,
};
