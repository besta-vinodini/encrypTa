import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiShieldKeyholeFill, RiLogoutBoxLine, RiSunLine, RiMoonLine } from 'react-icons/ri';

export default function Navbar() {
  const navigate  = useNavigate();
  const email     = localStorage.getItem('userEmail') || 'User';
  const initials  = email.slice(0, 2).toUpperCase();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
        </button>
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
