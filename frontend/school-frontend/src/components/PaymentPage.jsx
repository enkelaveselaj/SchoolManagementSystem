import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import paymentService from "../services/paymentService";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_YOUR_PUBLISHABLE_KEY"
);
const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL || "http://localhost:5005";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const amountValue = Number(amount) || 0;
    if (amountValue <= 0) {
      setMessage("Enter an amount greater than $0.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${STRIPE_API_URL}/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(amountValue * 100),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to create payment intent");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card details are not loaded. Please refresh the page.');
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        const status = result.paymentIntent?.status;
        setMessage(
          `${result.error.message}${status ? ` (status: ${status})` : ''}`
        );
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("Payment successful!");
        await paymentService.updatePaymentStatus({
          stripePaymentIntentId: result.paymentIntent.id,
          status: 'succeeded',
          paidAt: new Date().toISOString(),
        });
      } else {
        setMessage(
          `Payment status: ${result.paymentIntent?.status || 'unknown'}`
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(error?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        School Payment
      </h2>

      <p
        style={{
          color: "#666",
          marginBottom: "20px",
        }}
      >
        Pay monthly school fee.
      </p>

      <form onSubmit={handlePayment}>
        <div style={{ marginBottom: "20px" }}>
          <label>Amount ($)</label>

          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <CardElement />
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : `Pay $${amount}`}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "20px",
            fontWeight: "600",
            color: message.includes("successful")
              ? "#059669"
              : "#dc2626",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;