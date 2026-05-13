import axios from 'axios';

const PAYMENT_API_BASE_URL = import.meta.env.VITE_STRIPE_API_URL || 'http://localhost:5005';

const paymentClient = axios.create({
  baseURL: PAYMENT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

paymentClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

const paymentService = {
  createPaymentIntent: ({ amount, currency = 'usd', customerEmail, metadata }) =>
    paymentClient.post('/create-payment-intent', {
      amount,
      currency,
      customerEmail,
      metadata,
    }),
  updatePaymentStatus: ({ stripePaymentIntentId, status, paidAt }) =>
    paymentClient.patch(`/payments/${stripePaymentIntentId}`, {
      status,
      paidAt,
    }),
  getPayments: (params = {}) => paymentClient.get('/payments', { params }),
};

export default paymentService;
