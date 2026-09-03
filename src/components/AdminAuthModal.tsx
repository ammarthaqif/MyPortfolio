import React, { useState } from 'react';
import { Shield, KeyRound, X, Check, Lock } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
  savedPin: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  savedPin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = pinInput.trim();
    if (!cleanInput) {
      setError('Please enter your admin PIN or passcode.');
      return;
    }

    if (cleanInput === savedPin || cleanInput.toLowerCase() === 'admin') {
      setError('');
      setPinInput('');
      onAuthenticate();
    } else {
      setError('Incorrect PIN. Default PIN is "admin" or click Quick Unlock below.');
    }
  };

  const handleQuickUnlock = () => {
    setError('');
    setPinInput('');
    onAuthenticate();
  };

  return (
    <div
      id="admin-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Admin Portfolio Access</h3>
              <p className="text-xs text-neutral-500">Authenticate to edit portfolio data & sync settings</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="admin-pin-input" className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Admin PIN / Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-pin-input"
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setError('');
                }}
                placeholder="Enter PIN (Default: admin)"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all font-mono"
              />
            </div>
            {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
          </div>

          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-xs text-neutral-600 space-y-1">
            <p className="font-semibold text-neutral-800">Admin privileges include:</p>
            <ul className="list-disc list-inside space-y-0.5 text-neutral-600 pl-1">
              <li>Automatic GitHub repository synchronization</li>
              <li>Live editing of developer bio, contact email, and headline</li>
              <li>Customizing metadata, descriptions, and launch links for any app</li>
              <li>Hiding or pinning apps as featured showcase items</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              type="submit"
              className="w-full sm:flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Admin Mode</span>
            </button>

            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold transition-all active:scale-98 whitespace-nowrap"
              title="One-click unlock for the portfolio owner"
            >
              1-Click Owner Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
