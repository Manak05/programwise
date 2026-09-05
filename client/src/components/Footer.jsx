import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pw-footer">
      <div className="container">
        <div className="pw-footer-top">
          <div className="pw-footer-brand">ProgramWise</div>
          <div className="pw-footer-tagline">Compare programs. Find the right fit.</div>
        </div>
        <nav className="pw-footer-links">
          <Link to="/explore">Explore</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/recommendations">Recommendations</Link>
          <a href="/#about">About</a>
          <a href="/#faq">FAQ</a>
        </nav>
        <div className="pw-footer-bottom">&copy; 2026 ProgramWise. All rights reserved.</div>
      </div>
    </footer>
  );
}