const express = require('express');
const router = express.Router();
const codesController = require('../controllers/codes.controller');

router.get('/codes/:code', codesController.resolveCode);

module.exports = router;
