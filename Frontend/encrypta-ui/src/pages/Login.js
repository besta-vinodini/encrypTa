import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { loginUser } from '../api';

/* ── Animated SVG Lock ──────────────────────────────────────── */
function LockSVG({ state }) {
  return (
    <svg viewBox="0 0 120 140" className="lock-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6d28d9" />
          <stop offset="50%"  stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="lockGradError" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#991b1b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="lockGradSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#059669" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="shackleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </linearGradient>
        <linearGradient id="shackleGradSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#34d399" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="bodyClip">
          <rect x="15" y="60" width="90" height="72" rx="14"/>
        </clipPath>
      </defs>

      {/* Lock body */}
      <rect
        className="lock-body-rect"
        x="15" y="60" width="90" height="72" rx="14"
        fill={state === 'error' ? 'url(#lockGradError)' : state === 'success' ? 'url(#lockGradSuccess)' : 'url(#lockGrad)'}
        filter="url(#glow)"
        opacity="0.95"
      />

      {/* Body shine */}
      <rect className="lock-shine" x="20" y="63" width="80" height="20" rx="8" />

      {/* Shackle */}
      <path
        className="lock-shackle"
        d="M 35 62 L 35 35 Q 35 12 60 12 Q 85 12 85 35 L 85 62"
        fill="none"
        stroke={state === 'success' ? 'url(#shackleGradSuccess)' : 'url(#shackleGrad)'}
        strokeWidth="10"
        strokeLinecap="round"
        style={state === 'success' ? {
          transform: 'translateY(-20px) rotate(22deg)',
          transformOrigin: '85px 62px',
          transition: 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), stroke 0.3s'
        } : { transition: 'transform 0.7s, stroke 0.3s' }}
      />

      {/* Keyhole */}
      <circle className="lock-keyhole-c" cx="60" cy="88" r="10" fill="rgba(0,0,0,0.45)" />
      <rect   className="lock-keyhole-r" x="56" y="96" width="8" height="14" rx="4" fill="rgba(0,0,0,0.45)" />

      {/* Scan line (only visible when scanning) */}
      {state === 'scanning' && (
        <rect
          className="lock-scan-line"
          x="20" y="64" width="80" height="3" rx="1.5"
          fill="rgba(139,92,246,0.8)"
          clipPath="url(#bodyClip)"
          style={{ animation: 'scanAnim 1.4s ease-in-out infinite' }}
        />
      )}

      {/* Ripple ring (email focus) */}
      {state === 'active' && (
        <circle
          cx="60" cy="100" r="55" fill="none"
          stroke="rgba(168,85,247,0.2)" strokeWidth="2"
          style={{ animation: 'rippleRing 1.5s ease-out infinite' }}
        />
      )}
    </svg>
  );
}

/* ── Particles ─────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    w: Math.random() * 6 + 2,
    left: Math.random() * 100,
    dur:  Math.random() * 8 + 6,
    delay: Math.random() * 8,
    drift: (Math.random() - 0.5) * 80,
  }));
  return (
    <div className="auth-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.w, height: p.w,
            left: `${p.left}%`,
            bottom: '-10px',
            '--dur':   `${p.dur}s`,
            '--delay': `${p.delay}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Login Component ──────────────────────────────────── */
export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [lockState, setLockState] = useState('idle'); // idle | active | scanning | error | success
  const [fieldFocus, setFieldFocus] = useState('');
  const navigate = useNavigate();

  /* Update lock state based on focus + content */
  useEffect(() => {
    if (lockState === 'error' || lockState === 'success') return;
    if (fieldFocus === 'password') setLockState('scanning');
    else if (fieldFocus === 'email')    setLockState('active');
    else setLockState('idle');
  }, [fieldFocus, lockState]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    setLockState('idle');
    try {
      const res  = await loginUser({ email, password });
      const user = res.data;
      localStorage.setItem('userId',    user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('username',  user.username || user.email);

      setLockState('success');
      toast.success(`Welcome back, ${user.username || user.email}!`);

      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err) {
      const msg = err.response?.data || 'Invalid email or password';
      setLockState('error');
      toast.error(typeof msg === 'string' ? msg : 'Login failed');
      setTimeout(() => setLockState(fieldFocus === 'password' ? 'scanning' : 'idle'), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-left">
        <Particles />

        <div className="auth-brand">
          {/* Animated Lock */}
          <div className={`lock-hero lock-${lockState}`}>
            <LockSVG state={lockState} />
            {lockState === 'success' && (
              <div className="lock-burst">
                <div className="lock-burst-ring animate" style={{ animationDelay: '0s' }} />
                <div className="lock-burst-ring animate" style={{ animationDelay: '0.15s' }} />
                <div className="lock-burst-ring animate" style={{ animationDelay: '0.3s' }} />
              </div>
            )}
          </div>

          <h1>EncrypTa</h1>
          <p>Your passwords, locked tight. Your data, yours alone.</p>
        </div>

        <div className="auth-taglines">
          {[
            { icon: '🔐', text: 'AES-256 Encryption' },
            { icon: '⚡', text: 'Instant secure access' },
            { icon: '🛡️', text: 'Zero-knowledge vault' },
          ].map(t => (
            <div key={t.text} className="auth-tagline">
              <div className="auth-tagline-icon">{t.icon}</div>
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-logo">
              <div className="auth-card-logo-icon">🔐</div>
              <div className="auth-card-logo-text">
                <h2>EncrypTa</h2>
                <p>Secure Password Vault</p>
              </div>
            </div>
            <h3>Welcome back</h3>
            <p className="auth-card-subtitle">Sign in to access your vault</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <RiMailLine className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFieldFocus('email')}
                  onBlur={() => setFieldFocus('')}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <RiLockPasswordLine className="input-icon" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFieldFocus('password')}
                  onBlur={() => setFieldFocus('')}
                  autoComplete="current-password"
                />
                <button type="button" className="input-action" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-footer">
            New to EncrypTa?&nbsp;
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
