import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  BarChart3,
  UserCheck,
  LogOut,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';

import paymentService from '../../services/paymentService';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY'
);
const STRIPE_API_URL =
  import.meta.env.VITE_STRIPE_API_URL || 'http://localhost:5005';

/* ---------------- PAYMENT COMPONENT ---------------- */

const PaymentForm = ({ customerEmail, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(10); // dollars
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const amountValue = Number(amount) || 0;
    if (amountValue <= 0) {
      setMessage("Enter an amount greater than $0.");
      setLoading(false);
      return;
    }

    try {
      // 1. create payment intent
      const res = await fetch(`${STRIPE_API_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amountValue * 100),
          customerEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to create payment intent.");
      }

      // 2. confirm card payment
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
        const detail = result.error.message || 'Payment method error';
        setMessage(
          `${detail}${status ? ` (status: ${status})` : ''}`
        );
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("Payment successful ✅");
        await paymentService.updatePaymentStatus({
          stripePaymentIntentId: result.paymentIntent.id,
          status: 'succeeded',
          paidAt: new Date().toISOString(),
        });
        onPaymentSuccess?.();
      } else {
        setMessage(
          `Payment status: ${result.paymentIntent?.status || 'unknown'}`
        );
      }
    } catch (err) {
      setMessage(err?.message || "Payment failed ❌");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <h2 style={{ marginBottom: 20 }}>School Payment</h2>

      <form onSubmit={handlePay}>
        <label>Amount ($)</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ width: "100%", padding: 10, margin: "10px 0" }}
        />

        <div style={{
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
          marginBottom: 20
        }}>
          <CardElement />
        </div>

        <button
          disabled={!stripe || loading}
          style={{
            width: "100%",
            padding: 12,
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 8
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 15 }}>{message}</p>
      )}
    </div>
  );
};

/* ---------------- MAIN PANEL ---------------- */

const ParentPanel = () => {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');

  const navigation = [
    { id: 'overview', name: 'Overview', icon: Users, description: 'View children overview' },
    { id: 'grades', name: 'Grades', icon: BarChart3, description: 'View academic performance' },
    { id: 'attendance', name: 'Attendance', icon: UserCheck, description: 'Track attendance records' },
    { id: 'assignments', name: 'Assignments', icon: FileText, description: 'View homework' },
    { id: 'payments', name: 'Payments', icon: FileText, description: 'Pay school fees' }
  ];

  const authUser = JSON.parse(localStorage.getItem('auth_user') || 'null');

  const paymentStats = {
    total: payments.length,
    succeeded: payments.filter((payment) => payment.status === 'succeeded').length,
    failed: payments.filter((payment) => payment.status === 'failed').length,
    pending: payments.filter((payment) => payment.status === 'requires_payment_method').length,
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (page === 'payments') {
      fetchPayments();
    }
  }, [page]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        'http://localhost:5001/admin/parents/me/children',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch children');

      const data = await response.json();
      setChildren(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true);
      setPaymentsError('');

      const response = await paymentService.getPayments({
        customerEmail: authUser?.email,
      });

      setPayments(response);
    } catch (err) {
      setPaymentsError(err?.error || err?.message || 'Failed to load payments.');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  const renderPage = () => {
    if (loading) {
      return <div className="panel-empty">Loading parent dashboard...</div>;
    }

    if (error) {
      return (
        <div className="panel-empty panel-empty--error">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      );
    }

    switch (page) {

      case 'payments':
        return (
          <div className="panel-content">
            <div className="panel-top">
              <div>
                <p className="panel-subtitle">Payments</p>
                <h2 className="panel-title">School fee management</h2>
                <p className="panel-copy">Quickly pay outstanding fees and review your payment history.</p>
              </div>
              <div className="stats-grid">
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-label">Total payments</span>
                  <strong>{paymentStats.total}</strong>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-label">Success</span>
                  <strong>{paymentStats.succeeded}</strong>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-label">Pending</span>
                  <strong>{paymentStats.pending}</strong>
                </div>
              </div>
            </div>

            <div className="panel-grid">
              <div className="panel-card">
                <h3>Make a payment</h3>
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    customerEmail={authUser?.email}
                    onPaymentSuccess={fetchPayments}
                  />
                </Elements>
              </div>

              <div className="panel-card">
                <h3>Payment history</h3>

                {paymentsLoading ? (
                  <p>Loading payment history...</p>
                ) : paymentsError ? (
                  <p className="panel-error">{paymentsError}</p>
                ) : payments.length === 0 ? (
                  <p>No payments have been recorded yet.</p>
                ) : (
                  <div className="history-list">
                    {payments.map((payment) => (
                      <div key={payment.id} className="history-card">
                        <div className="history-card__main">
                          <div>
                            <strong>${(payment.amount / 100).toFixed(2)}</strong>
                            <p>{new Date(payment.createdAt || payment.created_at).toLocaleString()}</p>
                          </div>
                          <span className={`status-pill status-pill--${payment.status.replace(/_/g, '-')}`}>
                            {payment.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {payment.customerEmail && (
                          <p className="history-card__meta">{payment.customerEmail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="panel-content">
            <div className="panel-top">
              <div>
                <p className="panel-subtitle">Family overview</p>
                <h2 className="panel-title">Your children</h2>
                <p className="panel-copy">Track your children's progress and stay updated with school activity.</p>
              </div>
            </div>

            <div className="children-grid">
              {children.map((child) => (
                <div key={child.id} className="child-card">
                  <div className="child-card__header">
                    <Users size={20} />
                    <strong>{child.first_name} {child.last_name}</strong>
                  </div>
                  <p>{child.email}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="panel-empty">Coming soon...</div>;
    }
  };

  return (
    <div className={`parent-panel ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="panel-sidebar">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>

        <div className="sidebar-brand">
          <div className="sidebar-brand__logo">P</div>
          {sidebarOpen && (
            <div>
              <h3>Parent Panel</h3>
              <p>Welcome back, {authUser?.email?.split('@')[0] || 'Parent'}</p>
            </div>
          )}
        </div>

        <nav className="panel-nav">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`panel-nav__item ${page === item.id ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <main className="panel-main">
        {renderPage()}
      </main>
    </div>
  );
};

export default ParentPanel;