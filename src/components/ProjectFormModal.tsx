import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initialProject?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject,
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'ai' | 'fullstack' | 'devtools' | 'creative'>('ai');
  const [tagsInput, setTagsInput] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [status, setStatus] = useState<'Published' | 'Live Production' | 'Beta' | 'Concept'>('Published');
  const [year, setYear] = useState('2025');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [previewTheme, setPreviewTheme] = useState<'neutral' | 'emerald' | 'blue' | 'amber' | 'rose'>('emerald');
  const [metricLabel, setMetricLabel] = useState('');
  const [metricValue, setMetricValue] = useState('');

  const [featured, setFeatured] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title);
      setTagline(initialProject.tagline);
      setDescription(initialProject.description);
      setCategory(initialProject.category);
      setTagsInput(initialProject.tags.join(', '));
      setLiveUrl(initialProject.liveUrl || '');
      setGithubUrl(initialProject.githubUrl || '');
      setStatus(initialProject.status);
      setYear(initialProject.year);
      setHighlightsInput(initialProject.highlights.join('\n'));
      setPreviewTheme(initialProject.previewTheme);
      setFeatured(initialProject.featured ?? false);
      setIsHidden(initialProject.isHidden ?? false);
      if (initialProject.metrics && initialProject.metrics.length > 0) {
        setMetricLabel(initialProject.metrics[0].label);
        setMetricValue(initialProject.metrics[0].value);
      }
    } else {
      setTitle('');
      setTagline('');
      setDescription('');
      setCategory('ai');
      setTagsInput('React, TypeScript, Gemini API');
      setLiveUrl('');
      setGithubUrl('');
      setStatus('Published');
      setYear(new Date().getFullYear().toString());
      setHighlightsInput('Sub-second latency response pipeline\nClean responsive typography and design');
      setPreviewTheme('emerald');
      setFeatured(false);
      setIsHidden(false);
      setMetricLabel('');
      setMetricValue('');
    }
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const metrics =
      metricLabel.trim() && metricValue.trim()
        ? [{ label: metricLabel.trim(), value: metricValue.trim() }]
        : initialProject?.metrics || [];

    const newProject: Project = {
      ...(initialProject || {}),
      id: initialProject?.id || `custom-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim() || 'Modern web application built with AI Studio',
      description: description.trim() || tagline.trim(),
      category,
      tags: tags.length > 0 ? tags : ['Web App', 'TypeScript'],
      liveUrl: liveUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      status,
      year: year.trim() || '2025',
      highlights: highlights.length > 0 ? highlights : ['Custom full-stack architecture'],
      previewTheme,
      metrics: metrics.length > 0 ? metrics : undefined,
      featured,
      isHidden,
      isCustom: initialProject?.isFromGitHub ? false : true,
      isFromGitHub: initialProject?.isFromGitHub,
      gitHubRepoId: initialProject?.gitHubRepoId,
      gitHubRepoName: initialProject?.gitHubRepoName,
      pushedAt: initialProject?.pushedAt,
      createdAt: initialProject?.createdAt,
      stars: initialProject?.stars,
      forks: initialProject?.forks,
    };

    onSave(newProject);
    onClose();
  };

  return (
    <div
      id="project-form-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="project-form-modal-dialog"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 sm:p-8 space-y-6 text-neutral-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              {initialProject ? 'Edit App Details' : 'Add Published App to Portfolio'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Add your applications developed with AI Studio to showcase them in your portfolio.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                App Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VisionFlow AI"
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
              >
                <option value="ai">AI & Multimodal</option>
                <option value="fullstack">Full-Stack Web App</option>
                <option value="devtools">Developer Tools</option>
                <option value="creative">Creative & Media</option>
              </select>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              One-Sentence Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Real-time document parsing and visual intelligence analyzer."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Full Project Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the app does, key architectural design, and why it was built..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Live URL (optional)
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://yourapp.example.com"
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                GitHub Repository (optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Tech stack tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Tech Stack Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React 19, TypeScript, Gemini 2.5, Tailwind CSS, Express"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden font-mono"
            />
          </div>

          {/* Status, Year, Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
              >
                <option value="Published">Published</option>
                <option value="Live Production">Live Production</option>
                <option value="Beta">Beta</option>
                <option value="Concept">Concept</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Preview Theme
              </label>
              <select
                value={previewTheme}
                onChange={(e) => setPreviewTheme(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
              >
                <option value="emerald">Emerald (AI & Clean)</option>
                <option value="neutral">Neutral (Slate / Mono)</option>
                <option value="blue">Blue (Realtime / Tech)</option>
                <option value="amber">Amber (Devtools)</option>
                <option value="rose">Rose (Creative / Media)</option>
              </select>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Key Features / Highlights (one per line)
            </label>
            <textarea
              rows={2}
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              placeholder="Fast response under 150ms&#10;Integrated multi-turn conversational agents&#10;Full offline fallback"
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
            />
          </div>

          {/* Metric Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Primary Metric Value (optional)
              </label>
              <input
                type="text"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
                placeholder="e.g. 50k+ or <15ms"
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Metric Label (optional)
              </label>
              <input
                type="text"
                value={metricLabel}
                onChange={(e) => setMetricLabel(e.target.value)}
                placeholder="e.g. Monthly Invocations"
                className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Visibility & Featured Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 bg-neutral-50 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-100/60 transition-colors">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-neutral-900 rounded-sm border-neutral-300 focus:ring-neutral-900"
              />
              <div className="text-xs">
                <span className="font-bold text-neutral-900 block">Featured Project</span>
                <span className="text-neutral-500">Pins to top with highlight showcase badge</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-neutral-50 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-100/60 transition-colors">
              <input
                type="checkbox"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
                className="w-4 h-4 text-neutral-900 rounded-sm border-neutral-300 focus:ring-neutral-900"
              />
              <div className="text-xs">
                <span className="font-bold text-neutral-900 block">Hide from Showcase</span>
                <span className="text-neutral-500">Hidden from public viewers (admin only)</span>
              </div>
            </label>
          </div>

          {initialProject?.isFromGitHub && (
            <div className="p-3 bg-neutral-100/70 border border-neutral-200 rounded-xl text-xs text-neutral-600">
              <span className="font-bold text-neutral-800">GitHub Synced Repository:</span> Customizations saved here persist locally and override the default git metadata on your portfolio.
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-project-submit-btn"
              type="submit"
              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm"
            >
              {initialProject ? 'Save Changes' : 'Add to Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
