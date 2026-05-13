const express = require('express');
const Message = require('../models/message');

const router = express.Router();

router.get('/', async (req, res) => {
  const { room } = req.query;
  if (!room) return res.status(400).json({ error: 'room query is required' });

  try {
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Failed to load messages', err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

router.post('/', async (req, res) => {
  const { room, senderEmail, senderName, senderRole, text } = req.body;
  if (!room || !senderEmail || !senderName || !text) {
    return res.status(400).json({ error: 'room, senderEmail, senderName, and text are required' });
  }

  try {
    const message = await Message.create({ room, senderEmail, senderName, senderRole, text });
    res.status(201).json(message);
  } catch (err) {
    console.error('Failed to save message', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;