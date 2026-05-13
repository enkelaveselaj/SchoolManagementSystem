const { Payment } = require('../models');

async function createPayment(payment) {
  return Payment.create(payment);
}

async function findPaymentByIntentId(stripePaymentIntentId) {
  return Payment.findOne({
    where: { stripePaymentIntentId },
  });
}

async function updatePaymentByIntentId(stripePaymentIntentId, updates) {
  await Payment.update(updates, {
    where: { stripePaymentIntentId },
  });
  return findPaymentByIntentId(stripePaymentIntentId);
}

async function getPayments(filter = {}) {
  return Payment.findAll({
    where: filter,
    order: [['created_at', 'DESC']],
    raw: true,
    nest: true,
  });
}

module.exports = {
  createPayment,
  findPaymentByIntentId,
  updatePaymentByIntentId,
  getPayments,
};
