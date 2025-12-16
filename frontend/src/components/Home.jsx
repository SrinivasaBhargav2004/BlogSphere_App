import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);
  function handleLogout() {
    localStorage.clear();
    setUsername('');
    navigate('/login');
    window.location.reload();
  }
  return (
    <div className="home-bg">
      <div className="home-container">
        <div className="glass-card">
          <h1 className="center-text">Welcome to BlogSphere</h1>
          <p className="center-desc">
            Write, share, and discover amazing programming blogs.<br />
            Smooth UI, powerful features, and a friendly community!
          </p>
          <div className="button-container">
            {!username ? (
              <>
                <button id="login-btn" onClick={() => navigate('/login')}>Login</button>
                <button id="register-btn" onClick={() => navigate('/register')}>Register</button>
              </>
            ) : (
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            )}
          </div>
        </div>
      </div>
      <div className="bubble-deco"></div>
    </div>
  );
}
export default Home;
