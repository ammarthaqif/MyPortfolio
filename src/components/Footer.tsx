import React from 'react';
import { ArrowUp, Download, Upload, RotateCcw } from 'lucide-react';
import { UserProfile } from '../types';

interface FooterProps {
  profile: UserProfile;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="portfolio-footer" className="bg-neutral-900 text-neutral-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          <div className="space-y-1">
            <div className="text-white font-bold text-base tracking-tight">
              {profile.name} — Portfolio
            </div>
            <p className="text-xs text-neutral-400">
              {profile.role} · {profile.location}
            </p>
          </div>

          {/* Quick Portfolio Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="export-portfolio-btn"
              type="button"
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors"
              title="Export all portfolio data as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              id="import-portfolio-btn"
              type="button"
              onClick={onImportData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors"
              title="Import portfolio JSON backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            <button
              id="reset-portfolio-btn"
              type="button"
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-lg text-xs font-medium transition-colors"
              title="Reset portfolio to curated default apps"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              id="scroll-to-top-btn"
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors ml-2"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {profile.name}. All projects documented and published.</p>
          <p className="flex items-center gap-1.5">
            <span>Built & published with Google AI Studio</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
