import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiShieldKeyholeFill, RiLogoutBoxLine } from 'react-icons/ri';

export default function Navbar() {
  const navigate  = useNavigate();
  const email     = localStorage.getItem('userEmail') || 'User';
  const initials  = email.slice(0, 2).toUpperCase();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => window.location.reload()}>
        <div className="navbar-brand-icon">
          <RiShieldKeyholeFill color="#fff" size={18} />
        </div>
        <span className="navbar-brand-name">EncrypTa</span>
      </div>

      <div className="navbar-right">
        <div className="user-badge">
          <div className="user-avatar">{initials}</div>
          <span>{email}</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          <RiLogoutBoxLine size={15} />
          Logout
        </button>
      </div>
    </nav>
  );
}
