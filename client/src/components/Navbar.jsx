"use client";
import { Shield, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';

const Navbar = ({ isLoggedIn, orgName, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="logo-container">
          <Shield className="logo-icon" />
          <span className="logo-text">Proof<span className="highlight">X</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-items">
          {!isLoggedIn ? (
            <Link to="/auth" className="login-button">
              <LogIn className="button-icon" />
              <span className="hide-on-mobile">Login</span>
            </Link>
          ) : (
            <Link to="/dashboard" className="login-button">
              <LogIn className="button-icon" />
              <span className="hide-on-mobile">Dashboard</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {!isLoggedIn ? (
            <Link 
              to="/auth" 
              className="mobile-login-button"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="button-icon" />
              Login
            </Link>
          ) : (
            <div className="org-name">
              <span>{orgName}</span> {/* Display Organization Name */}
              <button onClick={onLogout}>Logout</button> {/* Logout Button */}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
