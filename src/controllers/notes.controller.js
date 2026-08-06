const Note = require('../models/Note');
const generateCode = require('../utils/generateCode');

async function createNote(req, res) {
  const code = generateCode();
  const note = await Note.create({ owner: req.userId, ...req.body, code });
  res.status(201).json(note);
}

async function listMyNotes(req, res) {
  const notes = await Note.find({ owner: req.userId });
  res.json(notes);
}

async function deleteNote(req, res) {
  await Note.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  res.json({ success: true });
}

module.exports = { createNote, listMyNotes, deleteNote };
