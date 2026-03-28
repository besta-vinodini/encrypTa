import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  RiEyeLine, RiEyeOffLine, RiFileCopyLine,
  RiDeleteBin5Line, RiUserLine, RiEdit2Line,
} from 'react-icons/ri';
import { deletePassword } from '../api';

const CATEGORY_BADGES = {
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

const SITE_ICONS = {
  google: '🔍', github: '🐙', facebook: '📘',
  twitter: '🐦', 'x.com': '🐦', instagram: '📷',
  netflix: '🎬', amazon: '📦', discord: '💬',
  linkedin: '💼', spotify: '🎵', apple: '🍎',
  microsoft: '🪟', youtube: '▶️', reddit: '🤖',
};

function getSiteIcon(website) {
  const w = (website || '').toLowerCase();
  for (const [key, icon] of Object.entries(SITE_ICONS)) {
    if (w.includes(key)) return icon;
  }
  return '🔐';
}

export default function PasswordCard({ entry, onDeleted, onRequestVerify, onEdit }) {
  const [revealedPw, setRevealedPw] = useState(null);
  const [deleting,   setDeleting]   = useState(false);
  const [copied,     setCopied]     = useState(false);

  const handleTogglePassword = () => {
    if (revealedPw) {
      setRevealedPw(null);
    } else {
      onRequestVerify(entry.entryId, (decryptedPw) => {
        setRevealedPw(decryptedPw);
      });
    }
  };

  const copyPassword = () => {
    if (!revealedPw) { toast('Reveal the password first', { icon: '🔒' }); return; }
    navigator.clipboard.writeText(revealedPw).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete password for "${entry.website}"?`)) return;
    setDeleting(true);
    try {
      await deletePassword(entry.entryId);
      toast.success('Password deleted');
      onDeleted(entry.entryId);
    } catch {
      toast.error('Failed to delete');
      setDeleting(false);
    }
  };

  const category  = entry.category || 'Others';
  const badgeCls  = CATEGORY_BADGES[category] || 'badge-other';

  return (
    <div
      className="pw-card"
      style={{ animationDelay: `${Math.random() * 150}ms` }}
    >
      {/* Header */}
      <div className="pw-card-header">
        <div className="site-icon">{getSiteIcon(entry.website)}</div>
        <div className="site-info">
          <div className="site-name">{entry.website}</div>
          <div className="site-username">
            <RiUserLine size={11} />
            {entry.username}
          </div>
        </div>
        <span className={`badge ${badgeCls}`}>{category}</span>
      </div>

      {/* Password display */}
      <div className="pw-card-body">
        <div className="pw-field-label">Password</div>
        <div className="pw-display">
          <span className={`pw-text${revealedPw ? ' revealed' : ''}`}>
            {revealedPw ?? '••••••••••••'}
          </span>
          <button
            className="btn btn-ghost btn-icon"
            onClick={handleTogglePassword}
            title={revealedPw ? 'Hide' : 'Show (requires verification)'}
            style={{ padding: '0.3rem', flexShrink: 0 }}
          >
            {revealedPw ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
          </button>
        </div>
      </div>

      {/* Actions (slide up on hover) */}
      <div className="pw-card-actions">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => onEdit(entry)}
          title="Edit"
        >
          <RiEdit2Line size={14} />
        </button>
        <button
          className={`btn btn-ghost btn-icon${copied ? ' copied' : ''}`}
          onClick={copyPassword}
          title="Copy password"
          style={copied ? { color: '#a855f7', borderColor: 'rgba(168,85,247,0.3)' } : {}}
        >
          <RiFileCopyLine size={14} />
        </button>
        <button
          className="btn btn-danger btn-icon"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
        >
          <RiDeleteBin5Line size={14} />
        </button>
      </div>
    </div>
  );
}
