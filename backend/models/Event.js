const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format'],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Venue is required'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      required: [true, 'Organizer is required'],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendee',
      },
    ],
    maxAttendees: {
      type: Number,
      required: [true, 'Max attendees is required'],
      min: [1, 'Max attendees must be at least 1'],
    },
    attendeesCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
