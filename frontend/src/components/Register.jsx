import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import '../styles/Register.css'; // Or App.css if classes are global
import '../App.css';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (!username || !email || !password) {
      setMessage("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + "/register", { username, email, password });
      setMessage(res.data.message || "Registration successful!");
      setLoading(false);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to register");
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-field">
          <label className="form-label" htmlFor="reg-username">Username</label>
          <input
            className="form-input"
            id="reg-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="reg-email">Email</label>
          <input
            className="form-input"
            id="reg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="reg-pass">Password</label>
          <input
            className="form-input"
            id="reg-pass"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <button className="form-btn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {message && <div className={`form-error${message.toLowerCase().includes("success") ? " form-success" : ""}`}>{message}</div>}
      </form>
    </div>
  );
}
export default Register;
