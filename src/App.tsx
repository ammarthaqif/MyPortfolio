import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { ProjectFormModal } from './components/ProjectFormModal';
import { SkillsSection } from './components/SkillsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AdminBanner } from './components/AdminBanner';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminControlModal } from './components/AdminControlModal';
import { INITIAL_PROJECTS } from './data/projects';
import { DEFAULT_PROFILE } from './data/profile';
import { Project, ProjectCategory, UserProfile, GitHubSyncConfig } from './types';
import { fetchGitHubRepos } from './services/github';
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  ExternalLink,
  Github,
  Star,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  RefreshCw,
} from 'lucide-react';

const STORAGE_PROJECTS_KEY = 'portfolio_apps_storage_v2';
const STORAGE_PROFILE_KEY = 'portfolio_profile_storage_v2';
const STORAGE_SYNC_CONFIG_KEY = 'portfolio_github_sync_v2';
const STORAGE_ADMIN_PIN_KEY = 'portfolio_admin_pin_v2';
const STORAGE_IS_ADMIN_KEY = 'portfolio_is_admin_v2';

const DEFAULT_SYNC_CONFIG: GitHubSyncConfig = {
  username: 'ammarthaqif',
  autoSync: true,
  syncIntervalMinutes: 60,
  excludeForks: true,
  syncStatus: 'idle',
};

export default function App() {
  // 1. Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Migration from v1 if present
      const savedV1 = localStorage.getItem('portfolio_apps_storage_v1');
      if (savedV1) {
        const parsedV1 = JSON.parse(savedV1);
        if (Array.isArray(parsedV1) && parsedV1.length > 0) return parsedV1;
      }
    } catch {
      // ignore
    }
    return INITIAL_PROJECTS;
  });

  // 2. Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
      const savedV1 = localStorage.getItem('portfolio_profile_storage_v1');
      if (savedV1) return JSON.parse(savedV1);
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  // 3. GitHub Sync Configuration
  const [syncConfig, setSyncConfig] = useState<GitHubSyncConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SYNC_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SYNC_CONFIG;
  });

  // 4. Admin Authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_IS_ADMIN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ADMIN_PIN_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '1234';
  });

  // UI Modals and Controls
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isAdminControlModalOpen, setIsAdminControlModalOpen] = useState(false);
  const [adminControlModalTab, setAdminControlModalTab] = useState<'profile' | 'github' | 'projects' | 'security'>('profile');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasAutoSyncedOnMount = useRef(false);

  // Count hidden projects for admin indicator
  const hiddenCount = useMemo(() => {
    return projects.filter((p) => p.isHidden).length;
  }, [projects]);

  // Persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SYNC_CONFIG_KEY, JSON.stringify(syncConfig));
    } catch {
      // ignore
    }
  }, [syncConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_IS_ADMIN_KEY, isAdmin ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ADMIN_PIN_KEY, adminPin);
    } catch {
      // ignore
    }
  }, [adminPin]);

  // Toast System
  const addToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // GitHub Synchronization Handler
  const handleTriggerSync = useCallback(
    async (showNotification = true, overrideConfig?: GitHubSyncConfig) => {
      const cfg = overrideConfig || syncConfig;
      if (!cfg.username?.trim()) {
        addToast('Please specify a GitHub username to sync.', 'info');
        return;
      }

      setIsSyncing(true);
      setSyncConfig((prev) => ({ ...prev, syncStatus: 'syncing', syncError: undefined }));

      try {
        const result = await fetchGitHubRepos(
          cfg.username.trim(),
          cfg.token,
          cfg.excludeForks
        );

        if (result.error) {
          setSyncConfig((prev) => ({
            ...prev,
            syncStatus: 'error',
            syncError: result.error,
          }));
          if (showNotification) {
            addToast(`GitHub Sync: ${result.error}`, 'error');
          }
          setIsSyncing(false);
          return;
        }

        const fetchedProjects = result.projects;

        // Merge fetched repos with existing projects
        setProjects((prevProjects) => {
          const updatedProjects = [...prevProjects];

          fetchedProjects.forEach((ghProj) => {
            const matchIndex = updatedProjects.findIndex(
              (p) =>
                (p.gitHubRepoId && p.gitHubRepoId === ghProj.gitHubRepoId) ||
                (p.gitHubRepoName && p.gitHubRepoName.toLowerCase() === (ghProj.gitHubRepoName || '').toLowerCase()) ||
                p.id === ghProj.id
            );

            if (matchIndex >= 0) {
              const existing = updatedProjects[matchIndex];
              // Preserve any custom overrides the user made, while updating live stats
              updatedProjects[matchIndex] = {
                ...ghProj,
                ...existing,
                // Refresh GitHub live counters
                stars: ghProj.stars,
                forks: ghProj.forks,
                pushedAt: ghProj.pushedAt,
                status: existing.status || ghProj.status,
                // Ensure GitHub links and flags are maintained
                isFromGitHub: true,
                gitHubRepoId: ghProj.gitHubRepoId,
                gitHubRepoName: ghProj.gitHubRepoName,
                githubUrl: ghProj.githubUrl || existing.githubUrl,
                liveUrl: existing.liveUrl || ghProj.liveUrl,
              };
            } else {
              // Brand new repo discovered! Add to top of list
              updatedProjects.unshift(ghProj);
            }
          });

          return updatedProjects;
        });

        // Update sync config status
        setSyncConfig((prev) => ({
          ...prev,
          syncStatus: 'success',
          lastSyncedAt: new Date().toISOString(),
          totalReposFound: fetchedProjects.length,
          syncError: undefined,
        }));

        if (showNotification) {
          addToast(
            `Successfully synced ${fetchedProjects.length} repositories from GitHub (@${cfg.username})!`,
            'success'
          );
        }
      } catch (err: any) {
        setSyncConfig((prev) => ({
          ...prev,
          syncStatus: 'error',
          syncError: err.message || 'Failed to fetch repositories',
        }));
        if (showNotification) {
          addToast(`GitHub sync failed: ${err.message || 'Network error'}`, 'error');
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [syncConfig, addToast]
  );

  // Auto-sync on application mount if enabled
  useEffect(() => {
    if (!hasAutoSyncedOnMount.current) {
      hasAutoSyncedOnMount.current = true;
      if (syncConfig.autoSync && syncConfig.username) {
        // Run silent background sync to ensure fresh repos
        handleTriggerSync(false);
      }
    }
  }, [handleTriggerSync, syncConfig.autoSync, syncConfig.username]);

  // Copy contact email
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setIsEmailCopied(true);
      addToast(`Email address (${profile.email}) copied to clipboard!`);
      setTimeout(() => setIsEmailCopied(false), 3000);
    } catch {
      addToast(`Email: ${profile.email}`, 'info');
    }
  };

  // Save project from modal (Add / Edit)
  const handleSaveProject = (savedProject: Project) => {
    setProjects((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === savedProject.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedProject;
        return updated;
      } else {
        return [savedProject, ...prev];
      }
    });
    addToast(`App "${savedProject.title}" saved to your portfolio!`);
    setEditingProject(null);
  };

  // Toggle project visibility (hide/show)
  const handleToggleVisibility = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedState = !p.isHidden;
          addToast(
            `"${p.title}" is now ${updatedState ? 'hidden from public view' : 'visible on portfolio'}.`,
            'info'
          );
          return { ...p, isHidden: updatedState };
        }
        return p;
      })
    );
  };

  // Toggle project featured status
  const handleToggleFeatured = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const nextFeatured = !p.featured;
          addToast(
            nextFeatured ? `"${p.title}" pinned as featured!` : `"${p.title}" unpinned.`,
            'info'
          );
          return { ...p, featured: nextFeatured };
        }
        return p;
      })
    );
  };

  // Delete project or hide GitHub repo
  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    addToast('Project removed from portfolio showcase.', 'info');
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };

  // Open Admin Control Center with a specific tab
  const handleOpenAdminCenterWithTab = (tab: 'profile' | 'github' | 'projects' | 'security' = 'profile') => {
    setAdminControlModalTab(tab);
    setIsAdminControlModalOpen(true);
  };

  // Admin Configuration Handlers
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    addToast('Profile information updated successfully!');
  };

  const handleSaveSyncConfig = (newConfig: GitHubSyncConfig) => {
    setSyncConfig(newConfig);
    addToast('GitHub repository sync settings updated.');
    // Trigger immediate sync with the updated config
    handleTriggerSync(true, newConfig);
  };

  const handleSaveAdminPin = (newPin: string) => {
    setAdminPin(newPin);
    addToast('Admin security PIN updated.');
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    addToast('Logged out of Admin mode.', 'info');
  };

  // Export portfolio JSON
  const handleExportData = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      profile,
      syncConfig,
      projects,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-apps-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Portfolio data exported as JSON.');
  };

  // Trigger JSON file upload
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.projects && Array.isArray(parsed.projects)) {
          setProjects(parsed.projects);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.syncConfig) setSyncConfig(parsed.syncConfig);
          addToast(`Successfully imported ${parsed.projects.length} applications!`);
        } else {
          addToast('Invalid portfolio backup file structure.', 'error');
        }
      } catch {
        addToast('Failed to parse portfolio JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (
      confirm(
        'Reset portfolio to initial curated applications? Any custom edits and cache will be refreshed.'
      )
    ) {
      setProjects(INITIAL_PROJECTS);
      setProfile(DEFAULT_PROFILE);
      setSyncConfig(DEFAULT_SYNC_CONFIG);
      localStorage.removeItem(STORAGE_PROJECTS_KEY);
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      localStorage.removeItem(STORAGE_SYNC_CONFIG_KEY);
      addToast('Portfolio reset to default curated projects.');
    }
  };

  // Filter projects by category, search, and visibility (if not admin)
  const filteredProjects = useMemo(() => {
    const list = projects.filter((p) => {
      // If not in Admin mode, hide items marked as isHidden
      if (!isAdmin && p.isHidden) {
        return false;
      }

      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        p.title.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    // Sort: Featured projects first, then by year or pushedAt desc
    return [...list].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      if (a.pushedAt && b.pushedAt) {
        return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
      }

      return (b.year || '0').localeCompare(a.year || '0');
    });
  }, [projects, activeCategory, searchQuery, isAdmin]);

  return (
    <div
      id="portfolio-app-root"
      className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white"
    >
      {/* Hidden file input for portfolio import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Admin Mode Sticky Top Banner */}
      {isAdmin && (
        <AdminBanner
          onOpenAdminCenter={handleOpenAdminCenterWithTab}
          onOpenAddModal={handleOpenAdd}
          onSyncGitHub={() => handleTriggerSync(true)}
          onExitAdmin={handleLogoutAdmin}
          isSyncing={isSyncing}
          repoCount={projects.length}
          hiddenCount={hiddenCount}
        />
      )}

      {/* Global Navigation Header */}
      <Header
        profile={profile}
        onOpenAddModal={handleOpenAdd}
        projectCount={projects.length}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
        onOpenAdminCenter={() => handleOpenAdminCenterWithTab('profile')}
      />

      <main className="flex-1">
        {/* Editorial Hero with Real-Time GitHub Sync Indicator */}
        <Hero
          profile={profile}
          totalApps={projects.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onOpenAddModal={handleOpenAdd}
          onCopyEmail={handleCopyEmail}
          isEmailCopied={isEmailCopied}
          syncConfig={syncConfig}
          onManualSync={() => handleTriggerSync(true)}
          isSyncing={isSyncing}
          onOpenAdminSync={() => {
            if (isAdmin) {
              handleOpenAdminCenterWithTab('github');
            } else {
              setIsAdminAuthModalOpen(true);
            }
          }}
        />

        {/* Projects Showcase Section */}
        <section id="projects" className="py-16 md:py-20 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="showcase-heading"
                    className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight"
                  >
                    Published Applications
                  </h2>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                      Admin Editing Mode
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
                  Showing {filteredProjects.length} of {projects.length} cataloged applications
                  {syncConfig.lastSyncedAt && (
                    <span className="hidden sm:inline">
                      {' '}· Synced with GitHub @{syncConfig.username}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Sync GitHub repos button */}
                <button
                  type="button"
                  id="sync-repos-section-btn"
                  onClick={() => handleTriggerSync(true)}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold border border-neutral-200 transition-all disabled:opacity-60"
                  title="Check GitHub for newly published repositories"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Check GitHub</span>
                </button>

                {/* View switcher: Grid vs Table */}
                <div className="inline-flex items-center p-1 bg-neutral-200/70 rounded-xl">
                  <button
                    type="button"
                    id="view-mode-grid-btn"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    id="view-mode-table-btn"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                    title="Compact list view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="add-app-in-showcase-btn"
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-all active:scale-95 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 ? (
              <div
                id="empty-search-state"
                className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8 space-y-4"
              >
                <div className="w-12 h-12 bg-neutral-100 text-neutral-500 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">
                  No projects match your current filters
                </h3>
                <p className="text-sm text-neutral-500 max-w-md mx-auto">
                  No applications found for &ldquo;{searchQuery}&rdquo; in category &ldquo;
                  {activeCategory}&rdquo;.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full text-xs font-semibold"
                  >
                    Clear All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerSync(true)}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold"
                  >
                    Sync from GitHub
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid Layout */
              <div
                id="projects-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelectProject={setSelectedProject}
                    onEditProject={handleOpenEdit}
                    onDeleteProject={handleDeleteProject}
                    onToggleVisibility={handleToggleVisibility}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            ) : (
              /* Compact Table / List Layout */
              <div
                id="projects-table-view"
                className="bg-white rounded-xl border border-neutral-200 overflow-x-auto shadow-xs"
              >
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Application</th>
                      <th className="py-3 px-4 font-semibold hidden sm:table-cell">Source / Category</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold hidden md:table-cell">Tech Stack</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProjects.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        className={`hover:bg-neutral-50/80 cursor-pointer transition-colors group ${
                          p.isHidden ? 'opacity-60 bg-neutral-50/30' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 group-hover:text-neutral-950">
                              {p.title}
                            </span>
                            {p.featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-sm border border-amber-300">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                <span>Featured</span>
                              </span>
                            )}
                            {p.isHidden && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-neutral-200 text-neutral-700 text-[10px] font-mono rounded-sm">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-500 line-clamp-1 max-w-sm">
                            {p.tagline}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5">
                            {p.isFromGitHub && (
                              <span
                                className="p-1 rounded-sm bg-neutral-100 text-neutral-700"
                                title="Synced from GitHub"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full text-xs font-mono uppercase bg-neutral-100 text-neutral-700">
                              {p.category}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 hidden md:cell">
                          <div className="flex items-center gap-1 flex-wrap">
                            {p.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-neutral-100 text-[11px] font-mono text-neutral-600 whitespace-nowrap"
                              >
                                {tag}
                              </span>
                            ))}
                            {p.tags.length > 3 && (
                              <span className="text-[10px] text-neutral-400 font-mono">
                                +{p.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleToggleVisibility(p.id)}
                                  className="p-1 text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
                                  title={p.isHidden ? 'Make visible' : 'Hide from public'}
                                >
                                  {p.isHidden ? (
                                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(p)}
                                  className="p-1 text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
                                  title="Edit details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Remove "${p.title}" from showcase?`)) {
                                      handleDeleteProject(p.id);
                                    }
                                  }}
                                  className="p-1 text-neutral-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedProject(p)}
                              className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md"
                            >
                              Case Study
                            </button>
                            {p.githubUrl && (
                              <a
                                href={p.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
                                title="Open GitHub repo"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {p.liveUrl && (
                              <a
                                href={p.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-100"
                                title="Open live URL"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Technical Capabilities Matrix */}
        <SkillsSection />

        {/* Engineering Ethos & App Process */}
        <AboutSection profile={profile} />

        {/* Contact Section */}
        <ContactSection
          profile={profile}
          onCopyEmail={handleCopyEmail}
          isEmailCopied={isEmailCopied}
          onNotify={(msg) => addToast(msg, 'info')}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        onExportData={handleExportData}
        onImportData={handleImportClick}
        onResetData={handleResetData}
      />

      {/* Project Case Study Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Project Add/Edit Modal */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        initialProject={editingProject}
      />

      {/* Admin PIN Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAuthenticate={() => {
          setIsAdmin(true);
          addToast('Admin mode activated. You can now edit portfolio information and sync settings.');
        }}
        savedPin={adminPin}
      />

      {/* Central Admin Control Modal */}
      <AdminControlModal
        isOpen={isAdminControlModalOpen}
        onClose={() => setIsAdminControlModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        syncConfig={syncConfig}
        onSaveSyncConfig={handleSaveSyncConfig}
        onTriggerSync={() => handleTriggerSync(true)}
        isSyncing={isSyncing}
        projects={projects}
        onToggleProjectVisibility={handleToggleVisibility}
        onToggleProjectFeatured={handleToggleFeatured}
        onEditProject={handleOpenEdit}
        onDeleteProject={handleDeleteProject}
        onOpenAddModal={handleOpenAdd}
        initialTab={adminControlModalTab}
        adminPin={adminPin}
        onUpdateAdminPin={handleSaveAdminPin}
        onExportData={handleExportData}
        onImportClick={handleImportClick}
        onResetData={handleResetData}
      />

      {/* Notification Toast System */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
