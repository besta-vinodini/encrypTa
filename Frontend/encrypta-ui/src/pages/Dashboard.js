import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  RiAddLine, RiSearchLine, RiShieldCheckLine,
  RiLockPasswordLine, RiGlobalLine, RiUserLine,
  RiEyeLine, RiEyeOffLine, RiCloseLine, RiSaveLine,
  RiPriceTag3Line, RiFilter3Line,
} from 'react-icons/ri';
import Sidebar from '../components/Navbar';
import PasswordCard from '../components/PasswordCard';
import VerifyPasswordModal from '../components/VerifyPasswordModal';
import { addPassword, getPasswordsByUser, updatePassword } from '../api';

/* ── Constants ─────────────────────────────────────────────── */
const CATEGORIES = [
  'Social Media','Work','Finance','Email','Shopping',
  'Entertainment','Education','Developer','Mobile Apps',
  'Healthcare','Travel','Subscriptions','Government','Others',
];

const CAT_ICONS = {
  'Social Media':'📱','Work':'💼','Finance':'💳','Email':'📧',
  'Shopping':'🛒','Entertainment':'🎬','Education':'📚','Developer':'💻',
  'Mobile Apps':'📲','Healthcare':'🏥','Travel':'✈️','Subscriptions':'🔁',
  'Government':'🏛️','Others':'🔐',
};

/* ── Count-up hook ─────────────────────────────────────────── */
function useCountUp(target, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ── Skeleton ──────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skel-card">
      <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
        <div className="skeleton" style={{ width:44, height:44, borderRadius:10 }} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
          <div className="skeleton skel-line w-60" />
          <div className="skeleton skel-line w-40" />
        </div>
      </div>
      <div className="skeleton skel-line w-80 h-8" />
      <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
        {[0,1,2].map(i => <div key={i} className="skeleton" style={{ width:30,height:30,borderRadius:8 }} />)}
      </div>
    </div>
  );
}

/* ── Stat Card (3D tilt) ───────────────────────────────────── */
function StatCard({ icon, label, value, colorClass, delay }) {
  const ref   = useRef(null);
  const count = useCountUp(value);
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
    ref.current.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div ref={ref} className="stat-card"
      style={{ animationDelay: delay, transition:'transform 0.15s ease,background 0.3s,border-color 0.3s,box-shadow 0.3s' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className={`stat-icon-wrap ${colorClass}`}>{icon}</div>
      <div className="stat-info">
        <div className="stat-num">{count}</div>
        <div className="stat-lbl">{label}</div>
      </div>
    </div>
  );
}

/* ── Dynamic Category Select ───────────────────────────────── */
function CategorySelect({ value, onChange, categoryCounts }) {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const sorted   = [...CATEGORIES].sort((a,b) => (categoryCounts[b]||0) - (categoryCounts[a]||0));
  const filtered = sorted.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  const usedCount = Object.keys(categoryCounts).length;
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button type="button" className="cat-select-trigger"
        onClick={() => { setOpen(o => !o); setQuery(''); }}>
        <span className="cat-select-icon">{CAT_ICONS[value]||'🔐'}</span>
        <span className="cat-select-label">{value}</span>
        {categoryCounts[value] > 0 && <span className="cat-select-count">{categoryCounts[value]}</span>}
        <span className="cat-select-arrow" style={{ transform: open ? 'rotate(180deg)':'none' }}>▾</span>
      </button>
      {open && (
        <div className="cat-dropdown">
          <div className="cat-dropdown-search">
            <span style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>🔍</span>
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search categories…" className="cat-dropdown-input"
              onClick={e => e.stopPropagation()} />
          </div>
          {!query && usedCount > 0 && <div className="cat-dropdown-section">Currently in use</div>}
          <div className="cat-dropdown-list">
            {filtered.length === 0 && <div style={{ padding:'0.75rem 1rem', color:'var(--text-muted)', fontSize:'0.85rem' }}>No match</div>}
            {filtered.map((cat, i) => {
              const count    = categoryCounts[cat] || 0;
              const isActive = cat === value;
              const isUsed   = count > 0;
              const prevCat  = i > 0 ? filtered[i-1] : null;
              const prevUsed = prevCat ? (categoryCounts[prevCat]||0) > 0 : true;
              const showDiv  = !query && prevUsed && !isUsed && i > 0;
              return (
                <React.Fragment key={cat}>
                  {showDiv && <div className="cat-dropdown-section" style={{ marginTop:'0.25rem' }}>All categories</div>}
                  <button type="button"
                    className={`cat-dropdown-item${isActive?' active':''}${isUsed?' used':''}`}
                    onClick={() => { onChange(cat); setOpen(false); setQuery(''); }}>
                    <span className="cat-item-icon">{CAT_ICONS[cat]}</span>
                    <span className="cat-item-label">{cat}</span>
                    {count > 0 && <span className="cat-item-count">{count} saved</span>}
                    {isActive && <span className="cat-item-check">✓</span>}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Password strength helpers ─────────────────────────────── */
function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8)           s++;
  if (pw.length >= 12)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const STR_COLORS = ['','active-weak','active-weak','active-fair','active-good','active-strong'];
const STR_LABELS = ['','Weak','Weak','Fair','Good','Strong'];

/* ── Add/Edit Modal ────────────────────────────────────────── */
function AddPasswordModal({ editId, initial, onSave, onClose, saving, categoryCounts }) {
  const [website,  setWebsite]  = useState(initial.website  || '');
  const [username, setUsername] = useState(initial.username || '');
  const [password, setPassword] = useState(initial.password || '');
  const [category, setCategory] = useState(initial.category || 'Others');
  const [showPw,   setShowPw]   = useState(false);
  const strength = getStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!website || !username || !password) { toast.error('Please fill in all fields'); return; }
    onSave({ website, username, password, category });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth:520 }}>
        <button className="modal-close" onClick={onClose}><RiCloseLine size={18} /></button>
        <div className="modal-header">
          <div className="modal-icon">{editId ? <RiSaveLine size={24}/> : <RiAddLine size={24}/>}</div>
          <h3 className="modal-title">{editId ? 'Edit Password' : 'Add New Password'}</h3>
          <p className="modal-subtitle">{editId ? 'Update the stored credentials below' : 'Securely store your credentials'}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-grid">
            <div className="field">
              <label>Website</label>
              <div className="input-wrapper">
                <RiGlobalLine className="input-icon" />
                <input placeholder="e.g. github.com" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Category</label>
              <CategorySelect value={category} onChange={setCategory} categoryCounts={categoryCounts || {}} />
            </div>
            <div className="field full">
              <label>Username / Email</label>
              <div className="input-wrapper">
                <RiUserLine className="input-icon" />
                <input placeholder="your@email.com" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            </div>
            <div className="field full">
              <label>Password</label>
              <div className="input-wrapper">
                <RiLockPasswordLine className="input-icon" />
                <input type={showPw?'text':'password'} placeholder="Enter or paste password"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="input-action" onClick={() => setShowPw(v=>!v)}>
                  {showPw ? <RiEyeOffLine/> : <RiEyeLine/>}
                </button>
              </div>
              {password.length > 0 && (
                <div className="modal-strength">
                  <div className="strength-bar">
                    {[1,2,3,4,5].map(s=><div key={s} className={`strength-seg ${strength>=s?STR_COLORS[strength]:''}`}/>)}
                  </div>
                  <div className="strength-label">Strength: <strong>{STR_LABELS[strength]||'Too short'}</strong></div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ width:'auto',margin:0 }}>
              <RiCloseLine size={15}/> Cancel
            </button>
            <button type="submit" className={`btn btn-primary${saving?' btn-loading':''}`} disabled={saving}
              style={{ width:'auto',margin:0 }}>
              {saving ? '' : <><RiSaveLine size={15}/> {editId?'Update':'Save Password'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Vault View ────────────────────────────────────────────── */
function VaultView({
  list, loading, search, setSearch,
  activeCategory, setActiveCategory,
  categoryCounts, onAdd, onEdit,
  onDeleted, onRequestVerify,
}) {
  const safeList = Array.isArray(list) ? list : [];
  const filtered = safeList.filter(p => {
    const matchSearch =
      (p.website||'').toLowerCase().includes(search.toLowerCase()) ||
      (p.username||'').toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || (p.category||'Others') === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="vault-view">
      {/* Vault toolbar */}
      <div className="vault-toolbar">
        <div className="vault-toolbar-left">
          <h2 className="vault-heading">
            <span className="vault-heading-icon">🔐</span>
            Password Vault
          </h2>
          <span className="vault-count-badge">{filtered.length} entries</span>
        </div>
        <div className="vault-toolbar-right">
          <div className="search-bar">
            <RiSearchLine className="search-icon" />
            <input id="vault-search" className="search-input"
              placeholder="Search by site or username…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button id="add-password-btn" className="btn-add" onClick={onAdd}>
            <RiAddLine size={16} /> Add Password
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="vault-cats">
        <div className="vault-cats-label"><RiFilter3Line size={13}/> Filter</div>
        <div className="category-filter">
          {['All', ...CATEGORIES].map(cat => (
            <button key={cat}
              className={`cat-pill${activeCategory===cat?' active':''}`}
              onClick={() => setActiveCategory(cat)}>
              {cat !== 'All' && <span style={{ marginRight:3 }}>{CAT_ICONS[cat]}</span>}
              {cat}
              {cat === 'All'
                ? <span className="pill-count">{safeList.length}</span>
                : categoryCounts[cat] ? <span className="pill-count">{categoryCounts[cat]}</span> : null}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="password-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_,i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            {safeList.length === 0
              ? <><h3>Your vault is empty</h3><p>Click "Add Password" to store your first credential.</p></>
              : <><h3>No results found</h3><p>Try a different search term or category.</p></>}
          </div>
        ) : (
          filtered.map((entry, i) => (
            <div key={entry.entryId} style={{ animationDelay:`${i*40}ms` }}>
              <PasswordCard entry={entry}
                onDeleted={onDeleted}
                onRequestVerify={onRequestVerify}
                onEdit={onEdit} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Placeholder views for other tabs ─────────────────────── */
function ComingSoonView({ icon, title, subtitle }) {
  return (
    <div className="vault-view">
      <div className="empty-state" style={{ paddingTop:'8rem' }}>
        <div className="empty-icon" style={{ fontSize:'4rem' }}>{icon}</div>
        <h3 style={{ fontSize:'1.3rem', marginBottom:'0.5rem' }}>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

/* ── Main Dashboard ────────────────────────────────────────── */
export default function Dashboard() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab,      setActiveTab]      = useState('vault');

  const [editId,      setEditId]      = useState(null);
  const [editInitial, setEditInitial] = useState({});
  const [saving,      setSaving]      = useState(false);
  const [verifyModal, setVerifyModal] = useState(null);

  const navigate = useNavigate();
  const userId   = localStorage.getItem('userId');
  const email    = localStorage.getItem('userEmail') || '';

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
    if (!userId) navigate('/');
    else loadPasswords();
  }, [userId, loadPasswords, navigate]);

  const safeList = Array.isArray(list) ? list : [];

  const categoryCounts = safeList.reduce((acc, p) => {
    const cat = p.category || 'Others';
    acc[cat]  = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const uniqueSites = new Set(safeList.map(p => p.website?.split('.')[0])).size;

  const openAdd   = () => { setEditId(null); setEditInitial({}); setShowAdd(true); };
  const handleEdit = (entry) => {
    handleRequestVerify(entry.entryId, (decryptedPw) => {
      setEditId(entry.entryId);
      setEditInitial({ website:entry.website, username:entry.username, password:decryptedPw, category:entry.category||'Others' });
      setShowAdd(true);
    });
  };
  const handleSave = async ({ website, username, password, category }) => {
    setSaving(true);
    try {
      if (editId) {
        const res = await updatePassword(editId, { website, username, password, category, user:{ id:userId } });
        setList(prev => prev.map(p => p.entryId === editId ? res.data : p));
        toast.success(`Updated password for ${website}!`);
      } else {
        const res = await addPassword({ website, username, password, category, user:{ id:userId } });
        setList(prev => [res.data, ...prev]);
        toast.success(`Password for ${website} saved!`);
      }
      setShowAdd(false); setEditId(null); setEditInitial({});
    } catch {
      toast.error(editId ? 'Failed to update' : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleted       = (id)          => setList(prev => prev.filter(p => p.entryId !== id));
  const handleRequestVerify = (entryId, cb) => setVerifyModal({ entryId, callback:cb });

  const greetHour = new Date().getHours();
  const greeting  = greetHour < 12 ? 'Good morning' : greetHour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = (localStorage.getItem('username') || email).split('@')[0];

  /* Tab → content */
  const renderContent = () => {
    switch (activeTab) {
      case 'vault':
        return (
          <VaultView
            list={list} loading={loading}
            search={search} setSearch={setSearch}
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            categoryCounts={categoryCounts}
            onAdd={openAdd} onEdit={handleEdit}
            onDeleted={handleDeleted} onRequestVerify={handleRequestVerify}
          />
        );
      case 'categories':
        return (
          <div className="vault-view">
            <div className="vault-toolbar">
              <div className="vault-toolbar-left">
                <h2 className="vault-heading"><span className="vault-heading-icon">🏷️</span>Categories</h2>
              </div>
            </div>
            <div className="cat-overview-grid">
              {CATEGORIES.map(cat => {
                const cnt = categoryCounts[cat] || 0;
                return (
                  <button key={cat} className={`cat-overview-card${cnt>0?' has-items':''}`}
                    onClick={() => { setActiveCategory(cat); setActiveTab('vault'); }}>
                    <span className="cat-ov-icon">{CAT_ICONS[cat]}</span>
                    <span className="cat-ov-name">{cat}</span>
                    <span className="cat-ov-count">{cnt} {cnt===1?'entry':'entries'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'security':
        return <ComingSoonView icon="🛡️" title="Security Center" subtitle="Password health reports coming soon." />;
      case 'profile':
        return (
          <div className="vault-view">
            <div className="vault-toolbar">
              <div className="vault-toolbar-left">
                <h2 className="vault-heading"><span className="vault-heading-icon">👤</span>Profile</h2>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">{(email.slice(0,2)||'US').toUpperCase()}</div>
              <div className="profile-info">
                <div className="profile-name">{localStorage.getItem('username') || email}</div>
                <div className="profile-email">{email}</div>
              </div>
              <div className="profile-stats">
                <div className="profile-stat"><span>{safeList.length}</span><label>Passwords</label></div>
                <div className="profile-stat"><span>{uniqueSites}</span><label>Sites</label></div>
                <div className="profile-stat"><span>{Object.keys(categoryCounts).length}</span><label>Categories</label></div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onRefresh={loadPasswords} />

      <div className="main-content">
        {/* Top greeting bar */}
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">{greeting}, {firstName} 👋</span>
            <span className="topbar-subtitle">
              {safeList.length} password{safeList.length !== 1?'s':''} secured in your vault
            </span>
          </div>
          {/* Stats inline in topbar */}
          <div className="topbar-stats">
            <div className="topbar-stat purple">
              <span className="topbar-stat-num">{safeList.length}</span>
              <span className="topbar-stat-lbl">Passwords</span>
            </div>
            <div className="topbar-stat pink">
              <span className="topbar-stat-num">{uniqueSites}</span>
              <span className="topbar-stat-lbl">Sites</span>
            </div>
            <div className="topbar-stat cyan">
              <span className="topbar-stat-num">{Object.keys(categoryCounts).length}</span>
              <span className="topbar-stat-lbl">Categories</span>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>

      {/* Add/Edit modal */}
      {showAdd && (
        <AddPasswordModal
          editId={editId} initial={editInitial}
          onSave={handleSave}
          onClose={() => { setShowAdd(false); setEditId(null); setEditInitial({}); }}
          saving={saving} categoryCounts={categoryCounts}
        />
      )}

      {/* Verify modal */}
      {verifyModal && (
        <VerifyPasswordModal
          entryId={verifyModal.entryId}
          onClose={() => setVerifyModal(null)}
          onVerified={(pw) => { verifyModal.callback(pw); setVerifyModal(null); }}
        />
      )}
    </div>
  );
}
