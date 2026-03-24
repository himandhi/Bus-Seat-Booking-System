import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, isLoggedIn, logout } = useAuth();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo" onClick={() => navigate("/")}>
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#2563EB" />
            <path
              d="M5 8C5 6.9 5.9 6 7 6H17C18.1 6 19 6.9 19 8V15C19 15.6 18.6 16 18 16H17V17.5C17 17.8 16.8 18 16.5 18H15.5C15.2 18 15 17.8 15 17.5V16H9V17.5C9 17.8 8.8 18 8.5 18H7.5C7.2 18 7 17.8 7 17.5V16H6C5.4 16 5 15.6 5 15V8Z"
              fill="white"
            />
            <rect x="7" y="8.5" width="10" height="4" rx="1" fill="#2563EB" />
            <circle cx="8.5" cy="14.5" r="1" fill="#2563EB" />
            <circle cx="15.5" cy="14.5" r="1" fill="#2563EB" />
          </svg>
        </div>
        <span className="logo-text">BusGo</span>
      </div>

      {/* Nav Links */}
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <a
            key={link.path}
            className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            onClick={() => { navigate(link.path); setMenuOpen(false); }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* CTA Buttons */}
      <div className="header-actions">
        {isAdmin && (
          <button className="btn-admin" onClick={() => navigate("/admin/dashboard")}>
            🛡️ Admin Panel
          </button>
        )}
        {!isAdmin && (
          <button className="btn-primary" onClick={() => navigate("/routes-listing")}>
            Buy Tickets
          </button>
        )}
        {isLoggedIn ? (
          <div className="header-user">
            {!isAdmin && (
              <button className="btn-dashboard" onClick={() => navigate("/user/dashboard")}>
                Dashboard
              </button>
            )}
            <span className="header-username">👤 {user.name}</span>
            <button className="btn-outline" onClick={() => { logout(); navigate("/"); }}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn-outline" onClick={() => navigate("/login")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15M10 17L15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Login / Sign Up
          </button>
        )}
      </div>

      {/* Hamburger for mobile */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>
    </header>
  );
}
