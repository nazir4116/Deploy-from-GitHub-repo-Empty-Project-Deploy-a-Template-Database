const { Translate } = require('@google-cloud/translate').v2;

// Requires GOOGLE_TRANSLATE_API_KEY in your .env file
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

// POST /api/translate
// body: { text: "Hello", targetLang: "ha" }  (ha = Hausa language code)
exports.translateText = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({
        success: false,
        message: 'text and targetLang are required'
      });
    }

    const [translation] = await translate.translate(text, targetLang);

    return res.status(200).json({
      success: true,
      originalText: text,
      translatedText: translation,
      targetLang
    });
  } catch (error) {
    console.error('Translate error:', error);
    return res.status(500).json({
      success: false,
      message: 'Translation failed',
      error: error.message
    });
  }
};

// GET /api/translate/languages
// Returns list of supported languages (includes Hausa: "ha")
exports.getSupportedLanguages = async (req, res) => {
  try {
    const [languages] = await translate.getLanguages();
    return res.status(200).json({
      success: true,
      languages
    });
  } catch (error) {
    console.error('Get languages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get languages',
      error: error.message
    });
  }
};

// POST /api/translate/detect
// body: { text: "Sannu" }
exports.detectLanguage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'text is required'
      });
    }

    const [detection] = await translate.detect(text);

    return res.status(200).json({
      success: true,
      detected: detection
    });
  } catch (error) {
    console.error('Detect language error:', error);
    return res.status(500).json({
      success: false,
      message: 'Detection failed',
      error: error.message
    });
  }
};
