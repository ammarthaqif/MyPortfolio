import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Github } from 'lucide-react';
import { GitHubSyncConfig } from '../types';

interface GitHubSyncIndicatorProps {
  config: GitHubSyncConfig;
  onManualSync: () => void;
  isSyncing: boolean;
  className?: string;
  onOpenAdminSync?: () => void;
}

export const GitHubSyncIndicator: React.FC<GitHubSyncIndicatorProps> = ({
  config,
  onManualSync,
  isSyncing,
  className = '',
  onOpenAdminSync,
}) => {
  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return 'Not synced yet';
    const diffSeconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSeconds < 60) return 'Just now';
    const diffMins = Math.floor(diffSeconds / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div
      id="github-sync-indicator-widget"
      className={`inline-flex items-center flex-wrap gap-2 px-3 py-1.5 bg-white border border-neutral-200/90 rounded-full shadow-xs text-xs ${className}`}
    >
      <div className="flex items-center gap-1.5 text-neutral-800 font-medium">
        <Github className="w-3.5 h-3.5 text-neutral-900" />
        <span className="font-semibold">GitHub Auto-Sync:</span>
        <a
          href={`https://github.com/${config.username}`}
          target="_blank"
          rel="noreferrer"
          className="text-neutral-900 font-mono hover:underline truncate max-w-[110px]"
          title={`View github.com/${config.username}`}
        >
          @{config.username}
        </a>
      </div>

      <span className="text-neutral-300">|</span>

      <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
        {config.syncStatus === 'syncing' || isSyncing ? (
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
            <span>Syncing repos...</span>
          </span>
        ) : config.syncStatus === 'error' ? (
          <span
            className="flex items-center gap-1 text-rose-600 font-medium cursor-pointer"
            onClick={onOpenAdminSync}
            title={config.syncError || 'Sync failed'}
          >
            <AlertCircle className="w-3 h-3" />
            <span>Sync issue</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Updated {formatTimeAgo(config.lastSyncedAt)}</span>
          </span>
        )}
      </div>

      <button
        id="manual-sync-trigger-btn"
        type="button"
        onClick={onManualSync}
        disabled={isSyncing}
        className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors active:scale-90 disabled:opacity-50"
        title="Check for newly published repositories now"
        aria-label="Refresh GitHub Repositories"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-neutral-900' : ''}`} />
      </button>
    </div>
  );
};
