const Note = require('../models/Note');

async function resolveCode(req, res) {
  try {
    const { code } = req.params;
    const note = await Note.findOne({ code });
    if (!note) return res.status(404).json({ error: 'Code not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { resolveCode };
