import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiShieldKeyholeFill,
  RiLockPasswordLine,
  RiPriceTag3Line,
  RiUserLine,
  RiLogoutBoxLine,
  RiShieldCheckLine,
} from 'react-icons/ri';

export default function Sidebar({ activeTab, setActiveTab, onRefresh }) {
  const navigate  = useNavigate();
  const email     = localStorage.getItem('userEmail') || 'User';
  const initials  = email.slice(0, 2).toUpperCase();
  const [spinning, setSpinning] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleBrandClick = () => {
    if (spinning) return;          // already reloading, ignore double-click
    setSpinning(true);
    if (onRefresh) onRefresh();    // trigger parent data fetch
    // reset spin after 900ms (matches animation duration)
    setTimeout(() => setSpinning(false), 900);
  };

  const navItems = [
    { id: 'vault',      icon: <RiLockPasswordLine />, label: 'Password Vault' },
    { id: 'categories', icon: <RiPriceTag3Line />,   label: 'Categories' },
    { id: 'security',   icon: <RiShieldCheckLine />,  label: 'Security' },
    { id: 'profile',    icon: <RiUserLine />,          label: 'Profile' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand — click to reload */}
      <div
        className="sidebar-brand"
        onClick={handleBrandClick}
        title="Reload vault"
        style={{ cursor: 'pointer' }}
      >
        <div className={`sidebar-brand-icon${spinning ? ' icon-spin' : ''}`}>
          <RiShieldKeyholeFill color="#fff" size={20} />
        </div>
        <span className="sidebar-brand-text">EncrypTa</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item${activeTab === item.id ? ' active' : ''}`}
            onClick={() => setActiveTab && setActiveTab(item.id)}
            title={item.label}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <span className="sidebar-email">{email}</span>
        </div>
        <button className="sidebar-logout" onClick={logout} title="Logout">
          <span className="sidebar-item-icon"><RiLogoutBoxLine /></span>
          <span className="sidebar-item-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
