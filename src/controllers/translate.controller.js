async function translateText(req, res) {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'text and targetLanguage are required' });
    }

    const translated = `[${targetLanguage}] ${text}`;

    res.json({ original: text, targetLanguage, translated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { translateText };
