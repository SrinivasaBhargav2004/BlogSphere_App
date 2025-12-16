import { useState } from "react";
import axios from "axios"; // If you plan to use real API
// import '../styles/Contact.css'; // Or App.css/global
import '../App.css';

function Contact() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContact(e) {
    e.preventDefault();
    if (!name || !msg) {
      setMessage("Please enter your name and message.");
      return;
    }
    setLoading(true);
    try {
      // To connect to API, edit this accordingly
      // await axios.post(process.env.REACT_APP_API_URL + "/contact", { name, msg });
      setMessage("Message sent! We’ll reply soon.");
      setLoading(false);
      setName(""); setMsg("");
    } catch(err) {
      setMessage("Failed to send message.");
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Contact Us</h2>
      <form onSubmit={handleContact}>
        <div className="form-field">
          <label className="form-label" htmlFor="contact-name">Your Name</label>
          <input
            className="form-input"
            id="contact-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="contact-msg">Your Message</label>
          <textarea
            className="form-textarea"
            id="contact-msg"
            rows={5}
            value={msg}
            onChange={e => setMsg(e.target.value)}
            disabled={loading}
          />
        </div>
        <button className="form-btn" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
        {message && (
          <div className={`form-error${message.toLowerCase().includes("sent") ? " form-success" : ""}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
export default Contact;
