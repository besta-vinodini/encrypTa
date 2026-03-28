import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiMailLine, RiLockPasswordLine, RiUserLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { registerUser } from '../api';

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (pw.length >= 12)         s++;
  if (/[A-Z]/.test(pw))       s++;
  if (/[0-9]/.test(pw))       s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const LABELS = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['', 'active-weak', 'active-weak', 'active-fair', 'active-good', 'active-strong'];

function Particles() {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i, w: Math.random() * 5 + 2,
    left: Math.random() * 100,
    dur: Math.random() * 8 + 5,
    delay: Math.random() * 6,
    drift: (Math.random() - 0.5) * 70,
  }));
  return (
    <div className="auth-particles">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.w, height: p.w, left: `${p.left}%`, bottom: '-10px',
          '--dur': `${p.dur}s`, '--delay': `${p.delay}s`, '--drift': `${p.drift}px`,
        }} />
      ))}
    </div>
  );
}

export default function Register() {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();
  const strength = getStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password.length < 6)             { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await registerUser({ username, email, password });
      toast.success('Account created! Please sign in.');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left */}
      <div className="auth-left">
        <Particles />
        <div className="auth-brand">
          <div className="auth-brand-logo">🔐</div>
          <h1>EncrypTa</h1>
          <p>Join thousands securing their digital life</p>
        </div>
        <div className="auth-taglines">
          {[
            { icon: '✨', text: 'Free forever — no limits' },
            { icon: '🔒', text: 'Military-grade encryption' },
            { icon: '🌐', text: 'Access anywhere, anytime' },
          ].map(t => (
            <div key={t.text} className="auth-tagline">
              <div className="auth-tagline-icon">{t.icon}</div>
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
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
            <h3>Create your account</h3>
            <p className="auth-card-subtitle">Start securing your passwords today</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="field">
              <label htmlFor="reg-username">Username</label>
              <div className="input-wrapper">
                <RiUserLine className="input-icon" />
                <input
                  id="reg-username"
                  type="text"
                  placeholder="John Doe"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="reg-email">Email address</label>
              <div className="input-wrapper">
                <RiMailLine className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="reg-password">Password</label>
              <div className="input-wrapper">
                <RiLockPasswordLine className="input-icon" />
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="input-action" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {password.length > 0 && (
                <>
                  <div className="strength-bar">
                    {[1,2,3,4,5].map(s => (
                      <div key={s} className={`strength-seg ${strength >= s ? COLORS[strength] : ''}`} />
                    ))}
                  </div>
                  <div className="strength-label">
                    Strength: <strong>{LABELS[strength] || 'Too short'}</strong>
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              id="register-submit"
              className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?&nbsp;
            <Link to="/">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
