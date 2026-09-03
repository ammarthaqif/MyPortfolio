import { Project, GitHubSyncConfig } from '../types';

export interface RawGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  has_pages: boolean;
}

/**
 * Formats repository names into human-readable project titles
 * e.g., 'National-Badminton-Repository' -> 'National Badminton Repository'
 * 'ARDUINO-UNO-CODE-BLOCKS' -> 'Arduino Uno Code Blocks'
 */
export function formatRepoTitle(repoName: string): string {
  // Replace hyphens and underscores with spaces
  const clean = repoName.replace(/[-_]+/g, ' ').trim();
  
  // Title case words while preserving acronyms like AI, API, CLI, SQL, UI, IoT
  const acronyms = new Set(['AI', 'API', 'CLI', 'SQL', 'UI', 'IOT', 'ML', 'CSS', 'PDF', 'CRDT', 'URL', 'ID']);
  
  return clean
    .split(' ')
    .map((word) => {
      const upper = word.toUpperCase();
      if (acronyms.has(upper)) return upper;
      if (word.length <= 1) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Intelligent categorization based on repo topics, description, and language
 */
export function detectCategory(repo: RawGitHubRepo): 'ai' | 'fullstack' | 'devtools' | 'creative' {
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')} ${repo.language || ''}`.toLowerCase();

  if (
    text.includes('gemini') ||
    text.includes('prompt') ||
    text.includes('llm') ||
    text.includes('ai') ||
    text.includes('machine-learning') ||
    text.includes('openai') ||
    text.includes('vision') ||
    text.includes('neural')
  ) {
    return 'ai';
  }

  if (
    text.includes('audio') ||
    text.includes('sound') ||
    text.includes('music') ||
    text.includes('canvas') ||
    text.includes('webgl') ||
    text.includes('shader') ||
    text.includes('creative') ||
    text.includes('game')
  ) {
    return 'creative';
  }

  if (
    text.includes('cli') ||
    text.includes('devtool') ||
    text.includes('arduino') ||
    text.includes('docker') ||
    text.includes('sql') ||
    text.includes('database') ||
    text.includes('orchestrat') ||
    text.includes('benchmark') ||
    text.includes('compiler') ||
    text.includes('linter')
  ) {
    return 'devtools';
  }

  return 'fullstack';
}

/**
 * Assign an aesthetic preview theme based on category
 */
function getPreviewThemeForCategory(cat: 'ai' | 'fullstack' | 'devtools' | 'creative'): 'neutral' | 'emerald' | 'amber' | 'blue' | 'rose' {
  switch (cat) {
    case 'ai':
      return 'emerald';
    case 'devtools':
      return 'amber';
    case 'creative':
      return 'rose';
    case 'fullstack':
    default:
      return 'blue';
  }
}

/**
 * Convert a raw GitHub repo into our standardized Project entity
 */
export function mapGitHubRepoToProject(repo: RawGitHubRepo, username: string): Project {
  const category = detectCategory(repo);
  const title = formatRepoTitle(repo.name);
  const year = new Date(repo.pushed_at || repo.created_at).getFullYear().toString();

  // Determine live URL: use homepage if present, or github.io pages if enabled
  let liveUrl = repo.homepage?.trim() || undefined;
  if (!liveUrl && repo.has_pages) {
    liveUrl = `https://${username}.github.io/${repo.name}/`;
  }

  // Deduplicate and assemble tags
  const tagSet = new Set<string>();
  if (repo.language) tagSet.add(repo.language);
  (repo.topics || []).forEach((t) => tagSet.add(t));
  if (tagSet.size === 0) tagSet.add('TypeScript');

  const tags = Array.from(tagSet).slice(0, 6);

  // Derive metrics
  const metrics = [
    { label: 'Stars', value: `${repo.stargazers_count}` },
    { label: 'Forks', value: `${repo.forks_count}` },
  ];
  if (repo.watchers_count > 0 && repo.watchers_count !== repo.stargazers_count) {
    metrics.push({ label: 'Watchers', value: `${repo.watchers_count}` });
  }

  // Highlights
  const highlights: string[] = [];
  if (repo.description) {
    highlights.push(repo.description);
  }
  if (repo.has_pages) {
    highlights.push('Live interactive deployment published on GitHub Pages');
  }
  highlights.push(`Source code maintained with ${repo.language || 'modern web standards'}`);

  return {
    id: `gh-${repo.id}`,
    title,
    tagline: repo.description || `Published application repository: ${repo.name}`,
    description:
      repo.description ||
      `Open-source web application repository published on GitHub. Built with ${repo.language || 'TypeScript'} and modern web tooling.`,
    category,
    tags,
    liveUrl,
    githubUrl: repo.html_url,
    status: repo.archived ? 'Published' : (liveUrl ? 'Live Production' : 'Published'),
    year,
    metrics,
    highlights: highlights.slice(0, 3),
    previewTheme: getPreviewThemeForCategory(category),
    isFromGitHub: true,
    gitHubRepoId: repo.id,
    gitHubRepoName: repo.name,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
  };
}

/**
 * Fetch all public repositories for a GitHub user
 */
export async function fetchGitHubRepos(
  username: string,
  token?: string,
  excludeForks = true
): Promise<{ projects: Project[]; raw: RawGitHubRepo[]; error?: string }> {
  if (!username.trim()) {
    return { projects: [], raw: [], error: 'GitHub username is required.' };
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'AIStudio-App-Portfolio',
    };

    if (token && token.trim()) {
      headers.Authorization = `Bearer ${token.trim()}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username.trim())}/repos?sort=pushed&direction=desc&per_page=100`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { projects: [], raw: [], error: `GitHub user "${username}" was not found.` };
      }
      if (response.status === 403) {
        const rateLimitReset = response.headers.get('x-ratelimit-reset');
        const resetMsg = rateLimitReset
          ? ` Rate limit resets around ${new Date(Number(rateLimitReset) * 1000).toLocaleTimeString()}.`
          : '';
        return {
          projects: [],
          raw: [],
          error: `GitHub API rate limit exceeded.${resetMsg} Provide a GitHub Personal Access Token in Admin Settings for higher limits.`,
        };
      }
      return {
        projects: [],
        raw: [],
        error: `GitHub API error: ${response.status} ${response.statusText}`,
      };
    }

    const rawRepos: RawGitHubRepo[] = await response.json();

    if (!Array.isArray(rawRepos)) {
      return { projects: [], raw: [], error: 'Unexpected response format from GitHub API.' };
    }

    // Filter out forks if requested
    const filteredRepos = excludeForks ? rawRepos.filter((r) => !r.fork) : rawRepos;

    const mappedProjects = filteredRepos.map((r) => mapGitHubRepoToProject(r, username));

    return { projects: mappedProjects, raw: rawRepos };
  } catch (err: any) {
    return {
      projects: [],
      raw: [],
      error: err?.message || 'Network error while contacting GitHub API.',
    };
  }
}
