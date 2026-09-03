import React from 'react';
import { ArrowDown, Copy, Check, ExternalLink, Sparkles, Plus, Search, Filter } from 'lucide-react';
import { ProjectCategory, UserProfile, GitHubSyncConfig } from '../types';
import { GitHubSyncIndicator } from './GitHubSyncIndicator';

interface HeroProps {
  profile: UserProfile;
  totalApps: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: ProjectCategory;
  onSelectCategory: (cat: ProjectCategory) => void;
  onOpenAddModal: () => void;
  onCopyEmail: () => void;
  isEmailCopied: boolean;
  syncConfig: GitHubSyncConfig;
  onManualSync: () => void;
  isSyncing: boolean;
  onOpenAdminSync?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  totalApps,
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  onOpenAddModal,
  onCopyEmail,
  isEmailCopied,
  syncConfig,
  onManualSync,
  isSyncing,
  onOpenAdminSync,
}) => {
  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai', label: 'AI & Multimodal' },
    { id: 'fullstack', label: 'Full-Stack Apps' },
    { id: 'devtools', label: 'Developer Tools' },
    { id: 'creative', label: 'Creative & Audio' },
  ];

  return (
    <section id="hero-section" className="pt-12 pb-16 md:pt-16 md:pb-20 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Status & Intro badge bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-full text-xs font-semibold text-neutral-800">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              <span>Developer Portfolio & Published Applications</span>
            </div>

            {/* GitHub Auto-Sync Live Indicator */}
            <GitHubSyncIndicator
              config={syncConfig}
              onManualSync={onManualSync}
              isSyncing={isSyncing}
              onOpenAdminSync={onOpenAdminSync}
            />
          </div>

          {/* Editorial Display Heading */}
          <h1
            id="hero-main-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.15]"
          >
            Engineering modern web applications, AI tools & full-stack experiences.
          </h1>

          {/* Subtitle / Bio */}
          <p
            id="hero-subtitle"
            className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl font-normal"
          >
            {profile.bio}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              id="hero-explore-projects-btn"
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm whitespace-nowrap"
            >
              <span>Explore {totalApps} Published Apps</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <button
              id="hero-add-app-btn"
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-full text-sm font-semibold text-neutral-800 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-neutral-600" />
              <span>Add Custom App</span>
            </button>

            <button
              id="hero-copy-email-btn"
              type="button"
              onClick={onCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-full text-sm font-medium text-neutral-700 transition-all active:scale-95 whitespace-nowrap"
              title="Copy direct contact email"
            >
              {isEmailCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Email Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-500" />
                  <span>{profile.email}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Filtering & Search Bar Header */}
        <div id="quick-controls" className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category tabs */}
            <div
              id="category-filters-container"
              className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`filter-cat-${cat.id}`}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 border border-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search filter input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="search-projects-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search apps or tech stack..."
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-white border border-neutral-300 rounded-full focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
