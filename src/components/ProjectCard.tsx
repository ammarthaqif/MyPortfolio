import React from 'react';
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  Star,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GitFork,
  Sparkles,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  onToggleVisibility?: (projectId: string) => void;
  isAdmin?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  onEditProject,
  onDeleteProject,
  onToggleVisibility,
  isAdmin = false,
}) => {
  // Theme color accents for the preview frame
  const themeStyles = {
    neutral: {
      headerBg: 'bg-neutral-100 border-neutral-200 text-neutral-800',
      pill: 'bg-neutral-200/80 text-neutral-800',
      accentDot: 'bg-neutral-500',
    },
    emerald: {
      headerBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
      pill: 'bg-emerald-100 text-emerald-800',
      accentDot: 'bg-emerald-500',
    },
    blue: {
      headerBg: 'bg-sky-50/70 border-sky-200 text-sky-900',
      pill: 'bg-sky-100 text-sky-800',
      accentDot: 'bg-sky-500',
    },
    amber: {
      headerBg: 'bg-amber-50/70 border-amber-200 text-amber-900',
      pill: 'bg-amber-100 text-amber-800',
      accentDot: 'bg-amber-500',
    },
    rose: {
      headerBg: 'bg-rose-50/70 border-rose-200 text-rose-900',
      pill: 'bg-rose-100 text-rose-800',
      accentDot: 'bg-rose-500',
    },
  }[project.previewTheme] || {
    headerBg: 'bg-neutral-100 border-neutral-200 text-neutral-800',
    pill: 'bg-neutral-200/80 text-neutral-800',
    accentDot: 'bg-neutral-500',
  };

  // Check if repository was pushed recently (within last 30 days)
  const isRecentlyPushed = React.useMemo(() => {
    if (!project.pushedAt) return false;
    const diffDays = (Date.now() - new Date(project.pushedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }, [project.pushedAt]);

  return (
    <article
      id={`project-card-${project.id}`}
      className={`group flex flex-col bg-white rounded-xl border overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-200 ${
        project.isHidden
          ? 'border-dashed border-neutral-300 opacity-70 bg-neutral-50/40'
          : 'border-neutral-200'
      }`}
    >
      {/* Hidden banner for admin */}
      {project.isHidden && (
        <div className="bg-neutral-800 text-neutral-200 px-3 py-1 text-[11px] font-mono flex items-center justify-between">
          <span className="flex items-center gap-1">
            <EyeOff className="w-3 h-3 text-neutral-400" />
            <span>Hidden from public visitors</span>
          </span>
          {onToggleVisibility && (
            <button
              type="button"
              onClick={() => onToggleVisibility(project.id)}
              className="underline text-amber-400 hover:text-amber-300 text-[10px]"
            >
              Make Public
            </button>
          )}
        </div>
      )}

      {/* Visual Application Mockup Header */}
      <div
        className={`relative h-44 px-4 py-3.5 border-b flex flex-col justify-between select-none ${themeStyles.headerBg}`}
      >
        {/* Browser / App Window Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 border border-neutral-400/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 border border-neutral-400/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 border border-neutral-400/50" />
            <span className="ml-2 text-[11px] font-mono text-neutral-600 truncate max-w-[130px] sm:max-w-[170px]">
              app://{project.gitHubRepoName || project.id}.local
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-100 text-amber-900 border border-amber-300/80">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>Featured</span>
              </span>
            )}

            {isRecentlyPushed && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-900 border border-emerald-300/80">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                <span>New</span>
              </span>
            )}

            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${themeStyles.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${themeStyles.accentDot}`} />
              {project.status}
            </span>

            {/* Admin actions inside header */}
            {isAdmin && (
              <div className="flex items-center gap-1 ml-1 pl-1 border-l border-neutral-300/60">
                {onToggleVisibility && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(project.id);
                    }}
                    className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
                    title={project.isHidden ? 'Make visible to public' : 'Hide from public'}
                  >
                    {project.isHidden ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}

                {onEditProject && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProject(project);
                    }}
                    className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
                    title="Edit project details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {onDeleteProject && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const msg = project.isFromGitHub
                        ? `Hide or remove "${project.title}" from portfolio display?`
                        : `Delete "${project.title}" from your portfolio?`;
                      if (confirm(msg)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="p-1 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove/Hide project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mockup content representation */}
        <div className="py-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500">
            <span>{project.category} · {project.year}</span>
            {project.isFromGitHub && (
              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-white/80 px-1.5 py-0.2 rounded-md font-sans font-medium">
                <Github className="w-3 h-3" />
                <span>GitHub</span>
              </span>
            )}
          </div>
          <div className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-neutral-950 transition-colors truncate">
            {project.title}
          </div>
          <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5 font-medium">
            {project.tagline}
          </p>
        </div>

        {/* Quick metrics bar */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200/70 text-xs">
          {project.metrics && project.metrics.length > 0 ? (
            <div className="flex items-center gap-3">
              {project.metrics.slice(0, 3).map((metric, idx) => (
                <div key={idx} className="flex items-baseline gap-1">
                  <span className="font-bold text-neutral-900">{metric.value}</span>
                  <span className="text-[10px] text-neutral-500">{metric.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
              <span>Ready for deployment</span>
            </div>
          )}

          {/* GitHub stars / forks counters */}
          {project.isFromGitHub && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-600">
              {project.stars !== undefined && project.stars > 0 && (
                <span className="flex items-center gap-0.5" title={`${project.stars} GitHub stars`}>
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{project.stars}</span>
                </span>
              )}
              {project.forks !== undefined && project.forks > 0 && (
                <span className="flex items-center gap-0.5" title={`${project.forks} forks`}>
                  <GitFork className="w-3 h-3 text-neutral-500" />
                  <span>{project.forks}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Key highlights snippet */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-1 pt-1">
              {project.highlights.slice(0, 2).map((highlight, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-neutral-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                  <span className="line-clamp-1">{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tech tags & Actions */}
        <div className="space-y-4 pt-2 border-t border-neutral-100">
          {/* Tech stack badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-mono text-neutral-700 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-xs text-neutral-500 font-mono pl-1">
                +{project.tags.length - 4}
              </span>
            )}
          </div>

          {/* Action links */}
          <div className="flex items-center justify-between pt-1">
            <button
              id={`view-details-${project.id}`}
              type="button"
              onClick={() => onSelectProject(project)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-700 hover:underline"
            >
              <span>View Case Study</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  id={`github-link-${project.id}`}
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors"
                  title="View repository on GitHub"
                  aria-label={`View GitHub repository for ${project.title}`}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  id={`live-link-${project.id}`}
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-all active:scale-95"
                >
                  <span>Launch</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

