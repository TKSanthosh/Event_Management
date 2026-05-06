const Venue = require('../models/Venue');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const cache = require('../utils/cache');

const CACHE_KEY = 'venues:all';

const getAllVenues = async () => {
  // venues list doesn't change often, so serve from cache when possible
  const cached = cache.get(CACHE_KEY);
  if (cached) return cached;

  const venues = await Venue.find().sort({ createdAt: -1 });
  cache.set(CACHE_KEY, venues);
  return venues;
};

const getVenueById = async (id) => {
  const venue = await Venue.findById(id);
  if (!venue) throw new AppError('Venue not found', 404);
  return venue;
};

const createVenue = async (data) => {
  const venue = await Venue.create(data);
  cache.del(CACHE_KEY);
  return venue;
};

const updateVenue = async (id, data) => {
  const venue = await Venue.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!venue) throw new AppError('Venue not found', 404);
  cache.del(CACHE_KEY);
  return venue;
};

const deleteVenue = async (id) => {
  const venue = await Venue.findById(id);
  if (!venue) throw new AppError('Venue not found', 404);

  // can't delete a venue that still has events attached — it would leave orphan references
  const linkedEvents = await Event.countDocuments({ venue: id });
  if (linkedEvents > 0) {
    throw new AppError(
      'Cannot delete venue with linked events. Remove or reassign events first.',
      400
    );
  }

  await venue.deleteOne();
  // clear cache so next GET reflects the deletion
  cache.del(CACHE_KEY);
};

module.exports = { getAllVenues, getVenueById, createVenue, updateVenue, deleteVenue };
