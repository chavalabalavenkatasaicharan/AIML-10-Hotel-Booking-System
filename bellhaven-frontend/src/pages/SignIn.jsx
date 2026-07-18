import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const result = await signin({ email, password });

      if (!result.ok) {
        setErrors(result.errors);
        return;
      }

      navigate(result.data.role === "ADMIN" ? "/admin" : "/");
    } catch (err) {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <h2>Sign In</h2>
        <form noValidate onSubmit={handleSubmit}>
          <div className={`form-group${errors.email ? ' invalid' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className={`form-group${errors.password ? ' invalid' : ''}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          {errors.form && (
            <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '10px' }}>
              {errors.form}
            </p>
          )}

          <button type="submit" className="form-submit-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
