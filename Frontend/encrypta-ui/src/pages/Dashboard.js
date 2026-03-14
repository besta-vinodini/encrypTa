import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  RiAddLine, RiSearchLine, RiShieldCheckLine,
  RiLockPasswordLine, RiGlobalLine, RiUserLine,
  RiEyeLine, RiEyeOffLine, RiCloseLine, RiSaveLine
} from 'react-icons/ri';
import Navbar from '../components/Navbar';
import PasswordCard from '../components/PasswordCard';
import { addPassword, getPasswordsByUser } from '../api';

function SkeletonCard() {
  return (
    <div className="skel-card">
      <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
        <div className="skeleton" style={{ width:42, height:42, borderRadius:8 }} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
          <div className="skeleton skel-line w-60" />
          <div className="skeleton skel-line w-40" />
        </div>
      </div>
      <div className="skeleton skel-line w-80 h-8" />
      <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
        <div className="skeleton" style={{ width:32, height:32, borderRadius:8 }} />
        <div className="skeleton" style={{ width:32, height:32, borderRadius:8 }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  // Add form state
  const [website,  setWebsite]  = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [saving,   setSaving]   = useState(false);

  const userId = localStorage.getItem('userId');

  const loadPasswords = useCallback(async () => {
    try {
      const res = await getPasswordsByUser(userId);
      setList(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Could not load passwords. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { 
    if (!userId) {
      navigate('/');
    } else {
      loadPasswords(); 
    }
  }, [userId, loadPasswords, navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!website || !username || !password) { toast.error('Please fill in all fields'); return; }
    setSaving(true);
    try {
      const res = await addPassword({ website, username, password, user: { id: userId } });
      setList(prev => [res.data, ...prev]);
      setWebsite(''); setUsername(''); setPassword('');
      setShowAdd(false);
      toast.success(`Password for ${website} saved!`);
    } catch {
      toast.error('Failed to save password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleted = (id) => {
    setList(prev => prev.filter(p => p.entryId !== id));
  };

  const safeList = Array.isArray(list) ? list : [];

  const filtered = safeList.filter(p =>
    (p.website  || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.username || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Navbar />

      <div className="dashboard-content">

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon purple"><RiShieldCheckLine /></div>
            <div className="stat-info">
              <div className="stat-num">{safeList.length}</div>
              <div className="stat-lbl">Total Passwords</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pink"><RiGlobalLine /></div>
            <div className="stat-info">
              <div className="stat-num">{new Set(safeList.map(p => p.website?.split('.')[0])).size}</div>
              <div className="stat-lbl">Unique Sites</div>
            </div>
          </div>
        </div>

        {/* Add Panel */}
        {showAdd && (
          <div className="add-panel">
            <div className="add-panel-title">
              <RiAddLine /> Add New Password
            </div>
            <form onSubmit={handleAdd}>
              <div className="add-panel-grid">
                <div className="field">
                  <label>Website</label>
                  <div className="input-wrapper">
                    <RiGlobalLine className="input-icon" />
                    <input
                      placeholder="e.g. github.com"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Username / Email</label>
                  <div className="input-wrapper">
                    <RiUserLine className="input-icon" />
                    <input
                      placeholder="your@email.com"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <RiLockPasswordLine className="input-icon" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button type="button" className="input-action" onClick={() => setShowPw(v => !v)}>
                      {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="add-panel-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>
                  <RiCloseLine size={16} /> Cancel
                </button>
                <button type="submit" className={`btn btn-primary${saving ? ' btn-loading' : ''}`} disabled={saving} style={{ width:'auto' }}>
                  {saving ? '' : <><RiSaveLine size={16} /> Save Password</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Header */}
        <div className="section-header">
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span className="section-title">Password Vault</span>
            <span className="badge badge-purple">{filtered.length}</span>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', alignItems:'center', flexWrap:'wrap' }}>
            <div className="search-wrapper">
              <RiSearchLine className="search-icon" />
              <input
                className="search-input"
                placeholder="Search websites or usernames…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {!showAdd && (
              <button className="btn btn-primary" style={{ width:'auto' }} onClick={() => setShowAdd(true)}>
                <RiAddLine size={16} /> Add Password
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="password-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔐</div>
              {safeList.length === 0
                ? <><h3>Your vault is empty</h3><p>Click "Add Password" to store your first entry.</p></>
                : <><h3>No results found</h3><p>Try a different search term.</p></>
              }
            </div>
          ) : (
            filtered.map((entry, i) => (
              <div key={entry.entryId} style={{ animationDelay: `${i * 40}ms` }}>
                <PasswordCard entry={entry} onDeleted={handleDeleted} />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
