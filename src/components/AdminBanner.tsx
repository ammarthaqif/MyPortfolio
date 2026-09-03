import React from 'react';
import { ShieldCheck, Settings, User, RefreshCw, Plus, LogOut, Eye } from 'lucide-react';

interface AdminBannerProps {
  onOpenAdminCenter: (initialTab?: 'profile' | 'github' | 'projects' | 'security') => void;
  onOpenAddModal: () => void;
  onSyncGitHub: () => void;
  onExitAdmin: () => void;
  isSyncing: boolean;
  repoCount: number;
  hiddenCount: number;
}

export const AdminBanner: React.FC<AdminBannerProps> = ({
  onOpenAdminCenter,
  onOpenAddModal,
  onSyncGitHub,
  onExitAdmin,
  isSyncing,
  repoCount,
  hiddenCount,
}) => {
  return (
    <aside
      id="admin-status-banner"
      aria-label="Admin control panel"
      className="bg-neutral-900 text-neutral-100 border-b border-neutral-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Admin identity badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-semibold text-[11px] tracking-wide uppercase">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Admin Mode</span>
          </span>
          <span className="text-neutral-400 hidden sm:inline">
            You have full editorial control. Changes update the portfolio live.
          </span>
          {hiddenCount > 0 && (
            <span className="inline-flex items-center gap-1 text-neutral-400 text-[11px] bg-neutral-800 px-2 py-0.5 rounded-md">
              <Eye className="w-3 h-3 text-neutral-500" />
              <span>{hiddenCount} hidden</span>
            </span>
          )}
        </div>

        {/* Quick action controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenAdminCenter('profile')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md font-medium transition-colors"
            title="Edit your bio, name, email, and social links"
          >
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAdminCenter('github')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md font-medium transition-colors"
            title="Configure GitHub auto-sync username and options"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-400" />
            <span>Sync Settings</span>
          </button>

          <button
            type="button"
            onClick={onSyncGitHub}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md font-medium transition-colors disabled:opacity-50"
            title="Check GitHub for newly published repos right now"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Check GitHub</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-md transition-colors"
            title="Add a custom app or case study"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add App</span>
          </button>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          <button
            type="button"
            onClick={onExitAdmin}
            className="inline-flex items-center gap-1 px-2 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
            title="Exit admin mode and view public portfolio"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
