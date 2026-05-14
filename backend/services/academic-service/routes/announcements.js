const express = require('express');
const notificationService = require('../services/notificationService');

const router = express.Router();

// POST - Send announcement to all students
router.post('/announcements', async (req, res) => {
  try {
    const { title, message, targetRole, link } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required' });
    }

    const result = await notificationService.createNotification({
      title,
      message,
      targetRole: targetRole || 'student',
      type: 'announcement',
      link: link || ''
    });

    res.status(201).json({
      message: 'Announcement sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending announcement:', error);
    res.status(500).json({ error: 'Failed to send announcement' });
  }
});

module.exports = router;
