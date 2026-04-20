import React, { useState } from "react";
import authService from "../services/authService";

const Login = ({ onLoginSuccess, onGoRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

            <div style={{ marginTop: 16 }}>
              <button type="button" className="btn-secondary" onClick={onGoRegister}>
                Create an account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
