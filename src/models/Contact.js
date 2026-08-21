const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  ownerId: {
    // the user who saved this contact
    type: String,
    required: true,
  },
  contactUserId: {
    // if the phone number matches an existing CodeLink user, link them here
    type: String,
    default: null,
  },
  name: {
    // the name the owner gave this contact (like a phone contact name)
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent the same owner from saving the same phone number twice
contactSchema.index({ ownerId: 1, phoneNumber: 1 }, { unique: true });

module.exports = mongoose.model('Contact', contactSchema);
