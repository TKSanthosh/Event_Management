const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organizer name is required'],
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
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organizer', organizerSchema);
