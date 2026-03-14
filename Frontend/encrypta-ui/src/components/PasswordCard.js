import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  RiEyeLine, RiEyeOffLine, RiFileCopyLine,
  RiDeleteBin5Line, RiGlobalLine, RiUserLine
} from 'react-icons/ri';
import { deletePassword } from '../api';

export default function PasswordCard({ entry, onDeleted }) {
  const [visible, setVisible] = useState(false);
  const [deleting, setDeleting]= useState(false);

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

  const copyPassword = () => {
    navigator.clipboard.writeText(entry.password).then(() => {
      toast.success('Password copied to clipboard!');
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
      toast.error('Failed to delete password');
      setDeleting(false);
    }
  };

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
      </div>

      <div className="pw-card-body">
        <div className="pw-field-label">Password</div>
        <div className="pw-display">
          <span className="pw-text">
            {visible ? entry.password : '•'.repeat(Math.min(entry.password?.length || 8, 16))}
          </span>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setVisible(v => !v)}
            title={visible ? 'Hide' : 'Show'}
          >
            {visible ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
          </button>
        </div>
      </div>

      <div className="pw-card-actions">
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
