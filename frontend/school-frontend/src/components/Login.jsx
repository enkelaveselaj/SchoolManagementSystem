import React, { useState } from "react";
import authService from "../services/authService";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);
    try {
      const result = await authService.login({ email, password });
      onLoginSuccess(result);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);

    try {
      const result = await authService.forgotPassword({ email: forgotEmail });
      setResetToken(result.dev_reset_token || null);
      if (!result.dev_reset_token) {
        setForgotError("Password reset initiated. Check your email for instructions.");
      }
    } catch (err) {
      setForgotError(err?.response?.data?.error || err?.message || "Failed to process password reset");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError(null);

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      return;
    }

    setResetLoading(true);
    try {
      await authService.resetPassword(resetToken, { newPassword });
      setResetSuccess(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetToken(null);
        setForgotEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setResetSuccess(false);
      }, 2000);
    } catch (err) {
      setResetError(err?.response?.data?.error || err?.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="page-header">
        <div className="container">
          <h1>Login</h1>
          <p>Sign in to your account</p>
        </div>
      </section>

      <section className="content">
        <div className="container">
          <div className="contact-form" style={{ maxWidth: 520, margin: "0 auto" }}>
            {error && (
              <div className="error" style={{ marginBottom: 16 }}>
                <p>{error}</p>
              </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6366f1",
                  cursor: "pointer",
                  fontSize: 14,
                  textDecoration: "underline"
                }}
              >
                Forgot password?
              </button>
            </div>

            <p style={{ marginTop: 16, color: "var(--secondary-600)", fontSize: 14 }}>
              Accounts are provisioned by the school administration. Contact support if you need access.
            </p>
          </div>
        </div>
      </section>

      {showForgotPassword && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            borderRadius: 12,
            padding: 32,
            maxWidth: 420,
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>
              {resetToken ? "Reset Password" : "Forgot Password"}
            </h2>

            {!resetToken ? (
              <>
                <p style={{ color: "#64748b", marginBottom: 20 }}>
                  Enter your email address and we'll help you reset your password.
                </p>

                {forgotError && (
                  <div className="error" style={{ marginBottom: 16 }}>
                    <p>{forgotError}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label htmlFor="forgot-email">Email</label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={forgotLoading}
                      style={{ flex: 1 }}
                    >
                      {forgotLoading ? "Processing..." : "Send Reset Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 20
                }}>
                  <p style={{ margin: 0, color: "#166534", fontSize: 14, fontWeight: 500 }}>
                    ✓ Reset code received: <code style={{ fontFamily: "monospace", fontSize: 12 }}>{resetToken}</code>
                  </p>
                </div>

                <p style={{ color: "#64748b", marginBottom: 20 }}>
                  Enter your new password below.
                </p>

                {resetSuccess && (
                  <div style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    color: "#166534"
                  }}>
                    <p style={{ margin: 0, fontSize: 14 }}>✓ Password reset successfully!</p>
                  </div>
                )}

                {resetError && (
                  <div className="error" style={{ marginBottom: 16 }}>
                    <p>{resetError}</p>
                  </div>
                )}

                <form onSubmit={handleResetPassword}>
                  <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={resetLoading || resetSuccess}
                      style={{ flex: 1 }}
                    >
                      {resetLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResetToken(null);
                        setForgotEmail("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setResetError(null);
                        setResetSuccess(false);
                      }}
                      className="btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Back
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
