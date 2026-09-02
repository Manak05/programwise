import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ProgramWise<span className="pw-brand-dot">.</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#pwNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="pwNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/explore">Explore Programs</Link></li>
            {user && user.role === 'student' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/recommendations">My Recommendations</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/saved">Saved Programs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/preferences">Preferences</Link></li>
              </>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item"><Link className="nav-link" to="/admin">Admin Dashboard</Link></li>
            )}
          </ul>
          <ul className="navbar-nav">
            {!user && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm ms-2" to="/register">Get Started</Link>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text text-muted small">{user.email}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
