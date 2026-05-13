require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const { sequelize } = require('./src/models');
const paymentRoutes = require('./src/routes/paymentRoutes');
const messageRoutes = require('./src/routes/messages');
const notificationRoutes = require('./src/routes/notifications');
const paymentService = require('./src/services/paymentService');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
    app.listen(port, () => {
      console.log(`Real-time service running on port ${port}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();