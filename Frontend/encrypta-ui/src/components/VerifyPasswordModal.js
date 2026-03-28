import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiShieldCheckLine, RiCloseLine } from 'react-icons/ri';
import { verifyPassword, getDecryptedPassword } from '../api';

export default function VerifyPasswordModal({ entryId, onClose, onVerified }) {
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) { setError('Please enter your password'); return; }
    setLoading(true); setError('');
    try {
      await verifyPassword(userId, password);
      const res = await getDecryptedPassword(entryId);
      toast.success('Password verified!');
      onVerified(res.data.password);
      onClose();
    } catch {
      setError('Incorrect password. Please try again.');
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <button className="modal-close" onClick={onClose}>
          <RiCloseLine size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            <RiShieldCheckLine size={26} />
          </div>
          <h3 className="modal-title">Re-authenticate</h3>
          <p className="modal-subtitle">
            Enter your login password to reveal the stored password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="verify-pw">Your Login Password</label>
            <div className="input-wrapper">
              <RiLockPasswordLine className="input-icon" />
              <input
                id="verify-pw"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoFocus
                autoComplete="current-password"
              />
              <button type="button" className="input-action" onClick={() => setShowPw(v => !v)}>
                {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            {error && <div className="modal-error">{error}</div>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ width: 'auto', margin: 0 }}>
              Cancel
            </button>
            <button
              type="submit"
              id="verify-submit"
              className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
              disabled={loading}
              style={{ width: 'auto', margin: 0 }}
            >
              {loading ? '' : <><RiShieldCheckLine size={15} /> Verify &amp; Reveal</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
