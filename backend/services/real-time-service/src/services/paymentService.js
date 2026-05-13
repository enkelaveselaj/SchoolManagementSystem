const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentRepository = require('../repositories/paymentRepository');

async function createPaymentIntent(amount, currency = 'usd', customerEmail = null, metadata = {}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });

  const payment = await paymentRepository.createPayment({
    stripePaymentIntentId: paymentIntent.id,
    amount,
    currency,
    status: paymentIntent.status,
    customerEmail,
    metadata,
  });

  return { paymentIntent, payment };
}

async function updatePaymentStatus(stripePaymentIntentId, status, paidAt = null) {
  return paymentRepository.updatePaymentByIntentId(stripePaymentIntentId, {
    status,
    paidAt,
  });
}

async function getPayments(customerEmail = null) {
  const filter = {};
  if (customerEmail) {
    filter.customerEmail = customerEmail;
  }
  return paymentRepository.getPayments(filter);
}

module.exports = {
  createPaymentIntent,
  updatePaymentStatus,
  getPayments,
};
