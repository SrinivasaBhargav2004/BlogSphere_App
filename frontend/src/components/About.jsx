import React from "react";
// import '../styles/About.css'; // Or App.css/global
import '../App.css';

function About() {
  return (
    <div className="info-card">
      <h2 className="info-title">About BlogSphere</h2>
      <div className="info-field">
        <p>
          BlogSphere is a platform for programmers to share, learn, and grow.
        </p>
        <p>
          Whether you’re just starting out or are an experienced developer, the BlogSphere community is here to support you.
        </p>
      </div>
    </div>
  );
}
export default About;
