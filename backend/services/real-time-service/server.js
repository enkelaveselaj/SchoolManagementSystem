require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./src/models');
const paymentRoutes = require('./src/routes/paymentRoutes');
const messageRoutes = require('./src/routes/messages');
const paymentService = require('./src/services/paymentService');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const notificationRoutes = require('./src/routes/notifications')(io);

app.use(cors());

// WEBHOOK MUST COME BEFORE express.json()
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature failed.', err.message);
      return res.sendStatus(400);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await paymentService.updatePaymentStatus(
        paymentIntent.id,
        'succeeded',
        new Date(paymentIntent.created * 1000)
      );
      console.log('Payment successful:', paymentIntent.id);
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      await paymentService.updatePaymentStatus(paymentIntent.id, 'failed');
      console.log('Payment failed:', paymentIntent.id);
    }

    res.sendStatus(200);
  }
);

// NOW express.json()
app.use(express.json());
app.use('/', paymentRoutes);
app.use('/messages', messageRoutes);
app.use('/notifications', notificationRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { room, senderEmail, senderName, senderRole, text } = data;
      
      // Save to database
      const Message = require('./src/models/message');
      const message = await Message.create({ room, senderEmail, senderName, senderRole, text });
      
      // Broadcast to room
      io.to(room).emit('newMessage', message);
    } catch (err) {
      console.error('Error sending message:', err);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_messaging';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Connect to MySQL
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('MySQL database connected and synced successfully.');

    const port = process.env.PORT || 5005;
    server.listen(port, () => {
      console.log(`Real-time service running on port ${port}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();