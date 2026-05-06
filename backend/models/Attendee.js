const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Attendee name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [/^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, 'Please provide a valid phone number'],
    },
    registeredEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendee', attendeeSchema);
