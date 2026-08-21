const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts.controller');

// Add a new contact
router.post('/', contactsController.addContact);

// Get all contacts for a user
router.get('/:ownerId', contactsController.getContacts);

// Update a contact's name
router.put('/:contactId', contactsController.updateContact);

// Block/unblock a contact
router.post('/:contactId/block', contactsController.toggleBlockContact);

// Delete a contact
router.delete('/:contactId', contactsController.deleteContact);

module.exports = router;
