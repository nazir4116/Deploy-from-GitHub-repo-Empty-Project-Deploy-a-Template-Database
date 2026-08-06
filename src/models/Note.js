const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    code: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
