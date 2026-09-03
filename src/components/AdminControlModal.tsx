import React, { useState } from 'react';
import {
  X,
  User,
  Github,
  Layers,
  Shield,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Star,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Download,
  Upload,
  Plus,
  Rocket,
} from 'lucide-react';
import { UserProfile, GitHubSyncConfig, Project } from '../types';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  syncConfig: GitHubSyncConfig;
  onSaveSyncConfig: (updated: GitHubSyncConfig) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  projects: Project[];
  onToggleProjectVisibility: (projectId: string) => void;
  onToggleProjectFeatured: (projectId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenAddModal: () => void;
  initialTab?: 'profile' | 'github' | 'projects' | 'security';
  adminPin: string;
  onUpdateAdminPin: (newPin: string) => void;
  onExportData: () => void;
  onImportClick: () => void;
  onResetData: () => void;
}

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  syncConfig,
  onSaveSyncConfig,
  onTriggerSync,
  isSyncing,
  projects,
  onToggleProjectVisibility,
  onToggleProjectFeatured,
  onEditProject,
  onDeleteProject,
  onOpenAddModal,
  initialTab = 'profile',
  adminPin,
  onUpdateAdminPin,
  onExportData,
  onImportClick,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'github' | 'projects' | 'security'>(initialTab);

  // Form states
  const [profileForm, setProfileForm] = useState<UserProfile>(profile);
  const [syncForm, setSyncForm] = useState<GitHubSyncConfig>(syncConfig);
  const [pinForm, setPinForm] = useState(adminPin);
  const [profileSavedFeedback, setProfileSavedFeedback] = useState(false);
  const [syncSavedFeedback, setSyncSavedFeedback] = useState(false);
  const [pinSavedFeedback, setPinSavedFeedback] = useState(false);

  // Project manager search filter
  const [projectSearch, setProjectSearch] = useState('');

  if (!isOpen) return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
    setProfileSavedFeedback(true);
    setTimeout(() => setProfileSavedFeedback(false), 3000);
  };

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSyncConfig(syncForm);
    setSyncSavedFeedback(true);
    setTimeout(() => setSyncSavedFeedback(false), 3000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinForm.trim()) return;
    onUpdateAdminPin(pinForm.trim());
    setPinSavedFeedback(true);
    setTimeout(() => setPinSavedFeedback(false), 3000);
  };

  const filteredProjects = projects.filter((p) => {
    const q = projectSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.gitHubRepoName && p.gitHubRepoName.toLowerCase().includes(q))
    );
  });

  return (
    <div
      id="admin-control-center-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Admin Management Center</h2>
              <p className="text-xs text-neutral-400">
                Update information, configure automated GitHub synchronization & manage repository visibility
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-200 bg-neutral-50 px-6 gap-2 overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Auto-Sync</span>
            {syncConfig.autoSync && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Apps & Repos</span>
            <span className="px-1.5 py-0.2 bg-neutral-200 text-neutral-700 rounded-full text-[10px]">
              {projects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Backup & Security</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PROFILE & BIO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Professional Role / Headline
                  </label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Contact Email (For Inquiries)
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Location / Timezone
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Availability Status
                </label>
                <input
                  type="text"
                  value={profileForm.availability}
                  onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                  placeholder="e.g. Available for Select Projects & Roles"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Developer Bio (Featured in Hero & About sections)
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.github || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.linkedin || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    X / Twitter URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.twitter || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Information</span>
                </button>

                {profileSavedFeedback && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Profile updated and saved!</span>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: GITHUB AUTO-SYNC ENGINE */}
          {activeTab === 'github' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <Github className="w-4 h-4 text-neutral-900" />
                      <span>Automated GitHub Repository Synchronization</span>
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Whenever you publish a new application or project to your GitHub account, the portfolio automatically pulls and displays it without manual input.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onTriggerSync}
                    disabled={isSyncing}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>

                {/* Status info bar */}
                <div className="mt-4 pt-3 border-t border-neutral-200/80 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-800">Status:</span>
                    {syncConfig.syncStatus === 'syncing' || isSyncing ? (
                      <span className="text-amber-600 font-medium">Fetching repositories from GitHub...</span>
                    ) : syncConfig.syncStatus === 'error' ? (
                      <span className="text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{syncConfig.syncError || 'Sync failed'}</span>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active · Connected to @{syncConfig.username}</span>
                      </span>
                    )}
                  </div>

                  {syncConfig.lastSyncedAt && (
                    <div className="text-neutral-500">
                      Last check: {new Date(syncConfig.lastSyncedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Sync Configuration Form */}
              <form onSubmit={handleSyncSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    GitHub Username
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-500">https://github.com/</span>
                    <input
                      type="text"
                      value={syncForm.username}
                      onChange={(e) => setSyncForm({ ...syncForm, username: e.target.value.trim() })}
                      required
                      placeholder="e.g. ammarthaqif"
                      className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Public repositories published under this account will be automatically cataloged.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">Background Auto-Sync</div>
                      <div className="text-[11px] text-neutral-500">Check for newly published repos automatically</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={syncForm.autoSync}
                      onChange={(e) => setSyncForm({ ...syncForm, autoSync: e.target.checked })}
                      className="w-4 h-4 text-neutral-900 rounded-sm border-neutral-300"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">Exclude Forked Repos</div>
                      <div className="text-[11px] text-neutral-500">Only show repos authored by you</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={syncForm.excludeForks}
                      onChange={(e) => setSyncForm({ ...syncForm, excludeForks: e.target.checked })}
                      className="w-4 h-4 text-neutral-900 rounded-sm border-neutral-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Auto-Sync Polling Interval
                  </label>
                  <select
                    value={syncForm.syncIntervalMinutes}
                    onChange={(e) => setSyncForm({ ...syncForm, syncIntervalMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  >
                    <option value={2}>Every 2 minutes (Fastest)</option>
                    <option value={5}>Every 5 minutes (Recommended)</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={30}>Every 30 minutes</option>
                    <option value={60}>Every hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Optional GitHub Personal Access Token (PAT)
                  </label>
                  <input
                    type="password"
                    value={syncForm.token || ''}
                    onChange={(e) => setSyncForm({ ...syncForm, token: e.target.value })}
                    placeholder="ghp_... (Optional, increases API limit from 60 to 5,000 req/hr)"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Never shared or committed. Stored only in your local browser storage for authenticating GitHub API calls.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Sync Preferences</span>
                  </button>

                  {syncSavedFeedback && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Sync settings saved!</span>
                    </span>
                  )}
                </div>
              </form>

              {/* Zero-Manual-Work GitHub Actions Publishing Section */}
              <div className="bg-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      GitHub Actions Automated Publishing
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  This portfolio includes a pre-configured <code className="text-amber-300 font-mono text-[11px]">.github/workflows/deploy.yml</code> workflow. Every push to <code className="text-neutral-200 font-mono text-[11px]">main</code> automatically builds and deploys directly to GitHub Pages with zero manual work.
                </p>
                <div className="bg-neutral-950/80 rounded-xl p-3 border border-neutral-800 text-xs font-mono text-neutral-300 space-y-1.5">
                  <div className="text-[11px] text-neutral-400 font-sans uppercase font-bold tracking-wider">
                    One-Time 10-Second Setup:
                  </div>
                  <div className="text-neutral-300">
                    1. Push this repository to your GitHub account (<span className="text-amber-300">github.com/{syncConfig.username || 'username'}/...</span>)
                  </div>
                  <div className="text-neutral-300">
                    2. Go to repository <span className="text-white font-semibold">Settings &gt; Pages</span>
                  </div>
                  <div className="text-neutral-300">
                    3. Under <span className="text-white font-semibold">Build and deployment &gt; Source</span>, choose <span className="text-emerald-400 font-bold">GitHub Actions</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Asset paths in <code className="text-neutral-300 font-mono">vite.config.ts</code> use relative base paths (<code className="text-neutral-300 font-mono">base: &apos;./&apos;</code>), ensuring perfect asset resolution on both custom domains and <code className="text-neutral-300 font-mono">username.github.io/repo-name/</code> subpaths.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE APPS & REPOS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Filter applications..."
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={onOpenAddModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom App</span>
                </button>
              </div>

              <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-600 font-mono uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Title / Repo</th>
                      <th className="py-2.5 px-3">Source</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Featured</th>
                      <th className="py-2.5 px-3 text-center">Visibility</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className={`hover:bg-neutral-50/80 transition-colors ${p.isHidden ? 'bg-neutral-50/50 opacity-60' : ''}`}>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-neutral-900">{p.title}</div>
                          <div className="text-[11px] text-neutral-500 font-mono truncate max-w-xs">
                            {p.gitHubRepoName ? `github:${p.gitHubRepoName}` : p.id}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          {p.isFromGitHub ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono font-medium text-neutral-700">
                              <Github className="w-3 h-3" />
                              <span>GitHub Auto</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-[10px] font-mono font-medium text-amber-800 border border-amber-200">
                              Custom
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 bg-neutral-100 rounded-full text-[10px] font-mono uppercase">
                            {p.category}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onToggleProjectFeatured(p.id)}
                            className={`p-1 rounded-md transition-colors ${
                              p.featured ? 'text-amber-500 hover:text-amber-600' : 'text-neutral-300 hover:text-neutral-500'
                            }`}
                            title={p.featured ? 'Unpin from featured' : 'Pin as featured showcase'}
                          >
                            <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-400' : ''}`} />
                          </button>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onToggleProjectVisibility(p.id)}
                            className={`p-1 rounded-md transition-colors ${
                              p.isHidden ? 'text-neutral-400 hover:text-neutral-600' : 'text-emerald-600 hover:text-emerald-700'
                            }`}
                            title={p.isHidden ? 'Click to make visible on portfolio' : 'Click to hide from portfolio'}
                          >
                            {p.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onEditProject(p)}
                              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                              title="Edit information & metadata"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove/reset "${p.title}"?`)) {
                                  onDeleteProject(p.id);
                                }
                              }}
                              className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title={p.isFromGitHub ? 'Hide this GitHub repo' : 'Delete custom app'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              {/* PIN Code Setup */}
              <form onSubmit={handlePinSubmit} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-neutral-800" />
                  <h3 className="text-sm font-bold text-neutral-900">Admin PIN / Passcode</h3>
                </div>
                <p className="text-xs text-neutral-600">
                  Set a passcode required to access Admin controls. Default is <code className="bg-neutral-200 px-1 py-0.5 rounded-sm">admin</code>.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={pinForm}
                    onChange={(e) => setPinForm(e.target.value)}
                    required
                    placeholder="New admin PIN"
                    className="w-48 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-neutral-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold"
                  >
                    Update PIN
                  </button>
                  {pinSavedFeedback && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>PIN updated!</span>
                    </span>
                  )}
                </div>
              </form>

              {/* Data Export & Backup */}
              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                <h3 className="text-sm font-bold text-neutral-900">Data Management & JSON Portability</h3>
                <p className="text-xs text-neutral-600">
                  Export all portfolio content, custom project overrides, and profile configurations to a portable JSON backup file.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={onExportData}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    type="button"
                    onClick={onImportClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-full text-xs font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Restore from JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={onResetData}
                    className="inline-flex items-center gap-1 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-full text-xs font-medium ml-auto"
                  >
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
