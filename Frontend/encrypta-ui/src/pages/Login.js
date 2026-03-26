import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiShieldKeyholeFill, RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { loginUser } from '../api';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      const user = res.data;
      localStorage.setItem('userId',    user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('username',  user.username || user.email);
      toast.success(`Welcome back, ${user.username || user.email}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data || 'Invalid email or password';
      toast.error(typeof msg === 'string' ? msg : 'Login failed');
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

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to access your vault</p>

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
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="input-action" onClick={() => setShowPw(v => !v)}>
                {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          New to EncrypTa?&nbsp;
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
