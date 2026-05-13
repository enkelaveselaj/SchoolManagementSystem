import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import paymentService from '../../services/paymentService'

const PaymentRecords = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await paymentService.getPayments()
        setPayments(response)
      } catch (err) {
        setError(err?.error || err?.message || 'Failed to load payment records.')
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const filteredPayments = payments.filter((payment) => {
    if (!searchText.trim()) return true
    const query = searchText.trim().toLowerCase()
    const email = (payment.customerEmail || payment.customer_email || '').toLowerCase()
    const name = (payment.customerName || payment.customer_name || '').toLowerCase()
    const id = (payment.id || payment.stripePaymentIntentId || '').toString().toLowerCase()
    return email.includes(query) || name.includes(query) || id.includes(query)
  })

  const paymentStats = {
    total: payments.length,
    succeeded: payments.filter((payment) => payment.status === 'succeeded').length,
    failed: payments.filter((payment) => payment.status === 'failed').length,
    pending: payments.filter((payment) => payment.status === 'requires_payment_method').length,
  }

  return (
    <div className="panel-content">
      <div className="panel-top">
        <div>
          <p className="panel-subtitle">Payment records</p>
          <h2 className="panel-title">Admin payment history</h2>
          <p className="panel-copy">Review all school payment transactions from the admin panel.</p>
        </div>
        <div className="stats-grid">
          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">Total payments</span>
            <strong>{paymentStats.total}</strong>
          </div>
          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">Succeeded</span>
            <strong>{paymentStats.succeeded}</strong>
          </div>
          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">Failed</span>
            <strong>{paymentStats.failed}</strong>
          </div>
          <div className="dashboard-stat-card">
            <span className="dashboard-stat-label">Pending</span>
            <strong>{paymentStats.pending}</strong>
          </div>
        </div>
      </div>

      <div className="panel-card">
        <h3>Payment history</h3>
        <div style={{ marginBottom: '1rem', maxWidth: '420px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by email, name, or payment ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading payment records...</p>
        ) : error ? (
          <p className="panel-error">
            <AlertCircle size={16} style={{ marginRight: 8 }} />
            {error}
          </p>
        ) : payments.length === 0 ? (
          <p>No payment records have been found.</p>
        ) : filteredPayments.length === 0 ? (
          <p>No payment records match your search.</p>
        ) : (
          <div className="history-list">
            {filteredPayments.map((payment) => (
              <div key={payment.id || payment.stripePaymentIntentId || payment.createdAt} className="history-card">
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
  )
}

export default PaymentRecords
