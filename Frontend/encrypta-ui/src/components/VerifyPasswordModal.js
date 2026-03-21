import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiShieldCheckLine, RiCloseLine } from 'react-icons/ri';
import { verifyPassword, getDecryptedPassword } from '../api';

export default function VerifyPasswordModal({ entryId, onClose, onVerified }) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await verifyPassword(userId, password);
      // Verification successful — now fetch the decrypted password
      const res = await getDecryptedPassword(entryId);
      toast.success('Password verified!');
      onVerified(res.data.password);
      onClose();
    } catch (err) {
      setError('Incorrect password. Please try again.');
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <RiCloseLine size={20} />
        </button>

        <div className="modal-icon">
          <RiShieldCheckLine size={28} />
        </div>
        <h3 className="modal-title">Re-authenticate</h3>
        <p className="modal-subtitle">
          Enter your login password to view the stored password
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Your Login Password</label>
            <div className="input-wrapper">
              <RiLockPasswordLine className="input-icon" />
              <input
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
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary modal-verify-btn${loading ? ' btn-loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : <><RiShieldCheckLine size={16} /> Verify & Reveal</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
