import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  RiShieldKeyholeFill, RiMailLine,
  RiLockPasswordLine, RiUserLine,
  RiEyeLine, RiEyeOffLine
} from 'react-icons/ri';
import { registerUser } from '../api';

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

const STRENGTH_MAP = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR= ['', 'active-weak', 'active-weak', 'active-fair', 'active-good', 'active-strong'];

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
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
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
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <RiShieldKeyholeFill color="#fff" size={24} />
          </div>
          <div className="auth-logo-text">
            <h1>EncrypTa</h1>
            <p>Secure Password Vault</p>
          </div>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Start securing your passwords today</p>

        <form onSubmit={handleRegister}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <RiUserLine className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

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
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <RiLockPasswordLine className="input-icon" />
              <input
                id="password"
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
                    <div
                      key={s}
                      className={`strength-seg ${strength >= s ? STRENGTH_COLOR[strength] : ''}`}
                    />
                  ))}
                </div>
                <div className="strength-label">
                  Password strength: <strong>{STRENGTH_MAP[strength] || 'Too short'}</strong>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?&nbsp;
          <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
