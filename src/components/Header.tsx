import React, { useState } from 'react';
import { Plus, Menu, X, Sparkles, Send, FolderGit2, Shield, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onOpenAddModal: () => void;
  projectCount: number;
  isAdmin?: boolean;
  onOpenAdminAuth: () => void;
  onOpenAdminCenter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenAddModal,
  projectCount,
  isAdmin = false,
  onOpenAdminAuth,
  onOpenAdminCenter,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Showcase', href: '#projects' },
    { label: 'Capabilities', href: '#skills' },
    { label: 'Engineering Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="portfolio-header"
      className="sticky top-0 z-40 w-full bg-neutral-50/90 backdrop-blur-md border-b border-neutral-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <a
            id="brand-logo-link"
            href="#"
            className="flex items-center gap-2.5 text-neutral-900 group"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-neutral-50 flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
              AT
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-neutral-900">
                {profile.name}
              </span>
              <span className="text-xs text-neutral-500 font-medium tracking-normal hidden sm:inline-block">
                Web & AI App Creator
              </span>
            </div>
          </a>

          {/* Availability pill */}
          <div
            id="availability-pill"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-semibold text-emerald-800 whitespace-nowrap ml-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for work</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Mode Pill / Button */}
          {isAdmin ? (
            <button
              id="admin-center-header-btn"
              type="button"
              onClick={onOpenAdminCenter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-full text-xs font-bold text-amber-900 transition-all"
              title="Open Admin Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Admin Mode</span>
            </button>
          ) : (
            <button
              id="admin-auth-header-btn"
              type="button"
              onClick={onOpenAdminAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-full text-xs font-semibold text-neutral-700 transition-all"
              title="Unlock Admin Mode"
            >
              <Shield className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          <button
            id="add-project-header-button"
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 rounded-full text-xs sm:text-sm font-semibold text-neutral-800 transition-all active:scale-95 whitespace-nowrap"
            title="Add a new project to your portfolio"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add App</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-neutral-200 text-neutral-700 rounded-full ml-0.5">
              {projectCount}
            </span>
          </button>

          <a
            id="contact-header-cta"
            href="#contact"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-50 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 whitespace-nowrap shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get in Touch</span>
          </a>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle-button"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden border-b border-neutral-200 bg-neutral-50 px-4 pt-2 pb-6 space-y-3"
        >
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-neutral-700" />
              {projectCount} apps currently cataloged
            </span>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminCenter();
                }}
                className="text-amber-800 font-bold underline"
              >
                Admin Center
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminAuth();
                }}
                className="text-neutral-700 font-medium underline"
              >
                Admin Sign-in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

