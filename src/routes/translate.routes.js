const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translate.controller');

// POST /api/translate - translate text
router.post('/translate', translateController.translateText);

// GET /api/translate/languages - list supported languages
router.get('/translate/languages', translateController.getSupportedLanguages);

// POST /api/translate/detect - detect language of a text
router.post('/translate/detect', translateController.detectLanguage);

module.exports = router;
