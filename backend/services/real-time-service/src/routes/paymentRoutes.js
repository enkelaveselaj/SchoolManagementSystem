const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.patch('/payments/:stripePaymentIntentId', paymentController.updatePaymentStatus);
router.get('/payments', paymentController.getPayments);

module.exports = router;
