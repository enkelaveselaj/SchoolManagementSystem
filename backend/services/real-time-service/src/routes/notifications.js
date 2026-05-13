const express = require('express');
const Notification = require('../models/notification');

const router = express.Router();

router.get('/', async (req, res) => {
  const { email, role } = req.query;

  try {
    const query = { $or: [] };

    if (email) query.$or.push({ targetEmail: email });
    if (role) query.$or.push({ targetRole: role });
    if (query.$or.length === 0) {
      return res.status(400).json({ error: 'email or role query is required' });
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Failed to load notifications', err);
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

router.post('/', async (req, res) => {
  const { title, message, targetRole, targetEmail, type, link } = req.body;
  if (!title || !message || !targetRole) {
    return res.status(400).json({ error: 'title, message, and targetRole are required' });
  }

  try {
    const notification = await Notification.create({
      title,
      message,
      targetRole,
      targetEmail: targetEmail || '',
      type: type || 'general',
      link: link || ''
    });
    res.status(201).json(notification);
  } catch (err) {
    console.error('Failed to save notification', err);
    res.status(500).json({ error: 'Failed to save notification' });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    console.error('Failed to mark notification as read', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;