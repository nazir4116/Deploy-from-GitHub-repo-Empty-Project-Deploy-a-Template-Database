const Status = require('../models/Status');

// Create a new status (photo/video/text) — expires in 24 hours
exports.createStatus = async (req, res) => {
  try {
    const { userId, mediaUrl, caption, type } = req.body;

    if (!userId || (!mediaUrl && !caption)) {
      return res.status(400).json({ message: 'userId and either mediaUrl or caption are required' });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const status = new Status({
      userId,
      mediaUrl: mediaUrl || null,
      caption: caption || '',
      type: type || 'text', // 'text', 'image', or 'video'
      viewedBy: [],
      createdAt: new Date(),
      expiresAt,
    });

    await status.save();
    res.status(201).json({ message: 'Status posted', status });
  } catch (err) {
    res.status(500).json({ message: 'Error creating status', error: err.message });
  }
};

// Get all active statuses for a single user
exports.getUserStatuses = async (req, res) => {
  try {
    const { userId } = req.params;
    const statuses = await Status.find({
      userId,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json({ statuses });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching statuses', error: err.message });
  }
};

// Get all active statuses from a list of contact userIds
// Expects contactIds as a comma-separated query param: ?contactIds=id1,id2,id3
exports.getContactsStatuses = async (req, res) => {
  try {
    const { contactIds } = req.query;

    if (!contactIds) {
      return res.status(400).json({ message: 'contactIds query param is required' });
    }

    const ids = contactIds.split(',');

    const statuses = await Status.find({
      userId: { $in: ids },
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    // Group by userId so the frontend can show one circle per contact
    const grouped = {};
    statuses.forEach((s) => {
      if (!grouped[s.userId]) grouped[s.userId] = [];
      grouped[s.userId].push(s);
    });

    res.status(200).json({ statuses: grouped });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contacts statuses', error: err.message });
  }
};

// Mark a status as viewed by a user
exports.markAsViewed = async (req, res) => {
  try {
    const { statusId } = req.params;
    const { viewerId } = req.body;

    if (!viewerId) {
      return res.status(400).json({ message: 'viewerId is required' });
    }

    const status = await Status.findById(statusId);
    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    if (!status.viewedBy.includes(viewerId)) {
      status.viewedBy.push(viewerId);
      await status.save();
    }

    res.status(200).json({ message: 'Status marked as viewed', status });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status view', error: err.message });
  }
};

// Delete a status manually (before it expires)
exports.deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const { userId } = req.body;

    const status = await Status.findById(statusId);
    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    if (status.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this status' });
    }

    await Status.findByIdAndDelete(statusId);
    res.status(200).json({ message: 'Status deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting status', error: err.message });
  }
};
