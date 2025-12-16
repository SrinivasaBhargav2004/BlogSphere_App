import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import '../styles/Login.css';
import '../App.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + "/login", { email, password });
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("isAdmin", res.data.isAdmin || false);
      setMessage(res.data.message || "Login successful!");
      setLoading(false);
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to log in");
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-field">
          <label className="form-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="form-input"
            type="email"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="login-pass">Password</label>
          <input
            id="login-pass"
            className="form-input"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <button className="form-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && (
          <div className={`form-error${message.toLowerCase().includes("success") ? " form-success" : ""}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
