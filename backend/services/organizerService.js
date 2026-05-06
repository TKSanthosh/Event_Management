const Organizer = require('../models/Organizer');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const cache = require('../utils/cache');

const CACHE_KEY = 'organizers:all';

const getAllOrganizers = async () => {
  // organizer list is fairly static, cache it to avoid hitting DB on every page load
  const cached = cache.get(CACHE_KEY);
  if (cached) return cached;

  const organizers = await Organizer.find().sort({ createdAt: -1 });
  cache.set(CACHE_KEY, organizers);
  return organizers;
};

const getOrganizerById = async (id) => {
  const organizer = await Organizer.findById(id);
  if (!organizer) throw new AppError('Organizer not found', 404);
  return organizer;
};

const createOrganizer = async (data) => {
  const organizer = await Organizer.create(data);
  cache.del(CACHE_KEY);
  return organizer;
};

const updateOrganizer = async (id, data) => {
  const organizer = await Organizer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!organizer) throw new AppError('Organizer not found', 404);
  cache.del(CACHE_KEY);
  return organizer;
};

const deleteOrganizer = async (id) => {
  const organizer = await Organizer.findById(id);
  if (!organizer) throw new AppError('Organizer not found', 404);

  // same idea as venue — can't remove an organizer while they still own events
  const linkedEvents = await Event.countDocuments({ organizer: id });
  if (linkedEvents > 0) {
    throw new AppError(
      'Cannot delete organizer with linked events. Remove or reassign events first.',
      400
    );
  }

  await organizer.deleteOne();
  cache.del(CACHE_KEY);
};

module.exports = {
  getAllOrganizers,
  getOrganizerById,
  createOrganizer,
  updateOrganizer,
  deleteOrganizer,
};
