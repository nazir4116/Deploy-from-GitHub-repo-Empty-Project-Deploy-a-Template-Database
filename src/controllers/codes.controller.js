const Note = require('../models/Note');

function generateSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Create a new code (text OR photo)
async function createCode(req, res) {
  try {
    const { type, content, title } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: 'type and content are required' });
    }
    if (type !== 'text' && type !== 'photo') {
      return res.status(400).json({ error: 'type must be "text" or "photo"' });
    }

    let code = generateSixDigitCode();
    let existing = await Note.findOne({ code });
    while (existing) {
      code = generateSixDigitCode();
      existing = await Note.findOne({ code });
    }

    const newNote = await Note.create({
      code,
      type,
      content: type === 'text' ? content : '',
      fileUrl: type === 'photo' ? content : '',
      title: title || (type === 'photo' ? 'Photo' : content.slice(0, 40)),
      owner: req.user?.id,
    });

    return res.status(201).json({
      code: newNote.code,
      type: newNote.type,
      title: newNote.title,
      createdAt: newNote.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create code' });
  }
}

// Unlock a code
async function unlockCode(req, res) {
  try {
    const { code } = req.params;
    const found = await Note.findOne({ code });

    if (!found) {
      return res.status(404).json({ error: 'No note found for this code' });
    }

    return res.status(200).json({
      code: found.code,
      type: found.type,
      title: found.title,
      content: found.type === 'photo' ? found.fileUrl : found.content,
      createdAt: found.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to unlock code' });
  }
}

module.exports = { createCode, unlockCode };
