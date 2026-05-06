const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Organizer = require('../models/Organizer');
const AppError = require('../utils/AppError');

const populateEvent = (query) =>
  query
    .populate('venue', 'name city address capacity')
    .populate('organizer', 'name organizationName email');

const getAllEvents = async (filters = {}) => {
  const { status, date, page = 1, limit = 20 } = filters;

  const query = {};
  if (status) query.status = status;
  if (date) query.date = new Date(date);

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // fetch data and total count together instead of two sequential queries
  const [events, total] = await Promise.all([
    populateEvent(Event.find(query).sort({ date: 1 }).skip(skip).limit(limitNum)),
    Event.countDocuments(query),
  ]);

  return {
    events,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getEventById = async (id) => {
  const event = await populateEvent(
    Event.findById(id).populate('attendees', 'name email phone')
  );
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

const createEvent = async (data) => {
  const venue = await Venue.findById(data.venue);
  if (!venue) throw new AppError('Venue not found', 404);

  const organizer = await Organizer.findById(data.organizer);
  if (!organizer) throw new AppError('Organizer not found', 404);

  // Prevent duplicate: same title at same venue on same date
  const duplicate = await Event.findOne({
    title: { $regex: new RegExp(`^${data.title}$`, 'i') },
    venue: data.venue,
    date: new Date(data.date),
  });
  if (duplicate) {
    throw new AppError(
      'An event with this title already exists at this venue on this date',
      409
    );
  }

  const event = await Event.create(data);
  return populateEvent(Event.findById(event._id));
};

const updateEvent = async (id, data) => {
  const event = await Event.findById(id);
  if (!event) throw new AppError('Event not found', 404);

  if (data.venue) {
    const venue = await Venue.findById(data.venue);
    if (!venue) throw new AppError('Venue not found', 404);
  }

  if (data.organizer) {
    const organizer = await Organizer.findById(data.organizer);
    if (!organizer) throw new AppError('Organizer not found', 404);
  }

  // exclude current event from duplicate check — otherwise updating title alone would conflict with itself
  if (data.title || data.venue || data.date) {
    const duplicate = await Event.findOne({
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${data.title || event.title}$`, 'i') },
      venue: data.venue || event.venue,
      date: new Date(data.date || event.date),
    });
    if (duplicate) {
      throw new AppError(
        'An event with this title already exists at this venue on this date',
        409
      );
    }
  }

  const updated = await Event.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return populateEvent(Event.findById(updated._id));
};

const deleteEvent = async (id) => {
  const event = await Event.findById(id);
  if (!event) throw new AppError('Event not found', 404);
  await event.deleteOne();
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
