import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import '../styles/Navigation.css';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  // Closes menu on link click (for mobile)
  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="nav-head">
        <div className="logo">
          <Link to="/" onClick={handleLinkClick}>BlogSphere</Link>
        </div>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/posts" onClick={handleLinkClick}>Posts</Link>
          <Link to="/createpost" onClick={handleLinkClick}>Create Post</Link>
          <Link to="/profile" onClick={handleLinkClick}>Profile</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
          <Link to="/about" onClick={handleLinkClick}>About</Link>
          {username ? (
            <button onClick={() => { handleLogout(); handleLinkClick(); }} className="logout-btn">Log Out</button>
          ) : (
            <>
              <Link to="/login" onClick={handleLinkClick}>Login</Link>
              <Link to="/register" onClick={handleLinkClick}>Register</Link>
            </>
          )}
        </div>
        {/* Hamburger toggler visible on mobile */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
