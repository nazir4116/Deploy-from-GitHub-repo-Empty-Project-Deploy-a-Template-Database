const express = require('express');
const router = express.Router();
const statusController = require('../controllers/status.controller');

// Create a new status
router.post('/', statusController.createStatus);

// Get a specific user's active statuses
router.get('/user/:userId', statusController.getUserStatuses);

// Get statuses for a list of contacts (e.g. /api/status/contacts?contactIds=id1,id2)
router.get('/contacts', statusController.getContactsStatuses);

// Mark a status as viewed
router.post('/:statusId/view', statusController.markAsViewed);

// Delete a status
router.delete('/:statusId', statusController.deleteStatus);

module.exports = router;
