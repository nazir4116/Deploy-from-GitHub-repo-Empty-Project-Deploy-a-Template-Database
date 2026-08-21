const Contact = require('../models/Contact');
const User = require('../models/User');

// Add a new contact by phone number
exports.addContact = async (req, res) => {
  try {
    const { ownerId, name, phoneNumber } = req.body;

    if (!ownerId || !name || !phoneNumber) {
      return res.status(400).json({ message: 'ownerId, name, and phoneNumber are required' });
    }

    // Check if this phone number belongs to an existing CodeLink user
    const matchedUser = await User.findOne({ phone: phoneNumber });

    const contact = new Contact({
      ownerId,
      contactUserId: matchedUser ? matchedUser._id : null,
      name,
      phoneNumber,
    });

    await contact.save();
    res.status(201).json({ message: 'Contact added', contact });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This contact is already saved' });
    }
    res.status(500).json({ message: 'Error adding contact', error: err.message });
  }
};

// Get all contacts for a user
exports.getContacts = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const contacts = await Contact.find({ ownerId, blocked: false }).sort({ name: 1 });
    res.status(200).json({ contacts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contacts', error: err.message });
  }
};

// Update a contact's saved name
exports.updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { name } = req.body;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (name) contact.name = name;
    await contact.save();

    res.status(200).json({ message: 'Contact updated', contact });
  } catch (err) {
    res.status(500).json({ message: 'Error updating contact', error: err.message });
  }
};

// Block or unblock a contact
exports.toggleBlockContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.blocked = !contact.blocked;
    await contact.save();

    res.status(200).json({ message: contact.blocked ? 'Contact blocked' : 'Contact unblocked', contact });
  } catch (err) {
    res.status(500).json({ message: 'Error updating block status', error: err.message });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting contact', error: err.message });
  }
};
