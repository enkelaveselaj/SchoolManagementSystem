const paymentService = require('../services/paymentService');

async function createPaymentIntent(req, res) {
  try {
    const { amount, currency = 'usd', customerEmail, metadata } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const { paymentIntent } = await paymentService.createPaymentIntent(
      Number(amount),
      currency,
      customerEmail,
      metadata || {}
    );

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('createPaymentIntent error:', err);
    return res.status(500).json({ error: err.message || 'Unable to create payment intent' });
  }
}

async function updatePaymentStatus(req, res) {
  try {
    const { stripePaymentIntentId } = req.params;
    const { status, paidAt } = req.body;

    if (!stripePaymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const payment = await paymentService.updatePaymentStatus(
      stripePaymentIntentId,
      status,
      paidAt ? new Date(paidAt) : null
    );

    return res.json(payment);
  } catch (err) {
    console.error('updatePaymentStatus error:', err);
    return res.status(500).json({ error: err.message || 'Unable to update payment status' });
  }
}

async function getPayments(req, res) {
  try {
    const { customerEmail } = req.query;
    const payments = await paymentService.getPayments(customerEmail);
    return res.json(payments);
  } catch (err) {
    console.error('getPayments error:', err);
    return res.status(500).json({ error: err.message || 'Unable to fetch payments' });
  }
}

module.exports = {
  createPaymentIntent,
  updatePaymentStatus,
  getPayments,
};
