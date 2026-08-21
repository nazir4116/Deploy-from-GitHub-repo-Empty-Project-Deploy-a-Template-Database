const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
    default: null,
  },
  caption: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text',
  },
  viewedBy: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// TTL index: MongoDB will automatically delete the document
// once expiresAt is in the past — no manual cleanup job needed.
statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Status', statusSchema);
