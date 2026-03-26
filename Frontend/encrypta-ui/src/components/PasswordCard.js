import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  RiEyeLine, RiEyeOffLine, RiFileCopyLine,
  RiDeleteBin5Line, RiUserLine, RiEdit2Line
} from 'react-icons/ri';
import { deletePassword } from '../api';

const CATEGORY_COLORS = {
  'Social Media':   'badge-social',
  'Work':           'badge-work',
  'Finance':        'badge-finance',
  'Email':          'badge-email',
  'Shopping':       'badge-shopping',
  'Entertainment':  'badge-entertainment',
  'Education':      'badge-education',
  'Developer':      'badge-developer',
  'Mobile Apps':    'badge-mobile',
  'Healthcare':     'badge-healthcare',
  'Travel':         'badge-travel',
  'Subscriptions':  'badge-subscriptions',
  'Government':     'badge-government',
  'Others':         'badge-other',
};

export default function PasswordCard({ entry, onDeleted, onRequestVerify, onEdit }) {
  const [revealedPw, setRevealedPw] = useState(null);
  const [deleting, setDeleting]     = useState(false);

  const getSiteIcon = (website) => {
    const w = (website || '').toLowerCase();
    if (w.includes('google'))   return '🔍';
    if (w.includes('github'))   return '🐙';
    if (w.includes('facebook')) return '📘';
    if (w.includes('twitter') || w.includes('x.com')) return '🐦';
    if (w.includes('instagram'))return '📷';
    if (w.includes('netflix'))  return '🎬';
    if (w.includes('amazon'))   return '📦';
    if (w.includes('discord'))  return '💬';
    if (w.includes('linkedin')) return '💼';
    return '🔐';
  };

  const handleTogglePassword = () => {
    if (revealedPw) {
      // already revealed → hide it
      setRevealedPw(null);
    } else {
      // request re-authentication
      onRequestVerify(entry.entryId, (decryptedPassword) => {
        setRevealedPw(decryptedPassword);
      });
    }
  };

  const copyPassword = () => {
    if (revealedPw) {
      navigator.clipboard.writeText(revealedPw).then(() => {
        toast.success('Password copied to clipboard!');
      });
    } else {
      toast('Reveal the password first before copying', { icon: '🔒' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete password for "${entry.website}"?`)) return;
    setDeleting(true);
    try {
      await deletePassword(entry.entryId);
      toast.success('Password deleted');
      onDeleted(entry.entryId);
    } catch {
      toast.error('Failed to delete password');
      setDeleting(false);
    }
  };

  const category = entry.category || 'Others';
  const badgeClass = CATEGORY_COLORS[category] || 'badge-other';

  return (
    <div className="pw-card">
      <div className="pw-card-header">
        <div className="site-icon">{getSiteIcon(entry.website)}</div>
        <div className="site-info">
          <div className="site-name">{entry.website}</div>
          <div className="site-username">
            <RiUserLine size={11} />
            {entry.username}
          </div>
        </div>
        <span className={`badge ${badgeClass}`}>{category}</span>
      </div>

      <div className="pw-card-body">
        <div className="pw-field-label">Password</div>
        <div className="pw-display">
          <span className="pw-text">
            {revealedPw ? revealedPw : '••••••••'}
          </span>
          <button
            className="btn btn-ghost btn-icon"
            onClick={handleTogglePassword}
            title={revealedPw ? 'Hide' : 'Show (requires verification)'}
          >
            {revealedPw ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
          </button>
        </div>
      </div>

      <div className="pw-card-actions">
        <button className="btn btn-ghost btn-icon" onClick={() => onEdit(entry)} title="Edit">
          <RiEdit2Line size={15} />
        </button>
        <button className="btn btn-ghost btn-icon" onClick={copyPassword} title="Copy password">
          <RiFileCopyLine size={15} />
        </button>
        <button
          className="btn btn-danger btn-icon"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
        >
          <RiDeleteBin5Line size={15} />
        </button>
      </div>
    </div>
  );
}
