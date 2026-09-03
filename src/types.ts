export type ProjectCategory = 'all' | 'ai' | 'fullstack' | 'devtools' | 'creative';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: 'ai' | 'fullstack' | 'devtools' | 'creative';
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  status: 'Published' | 'Live Production' | 'Beta' | 'Concept';
  year: string;
  metrics?: ProjectMetric[];
  highlights: string[];
  previewTheme: 'neutral' | 'emerald' | 'amber' | 'blue' | 'rose';
  isCustom?: boolean;
  isFromGitHub?: boolean;
  gitHubRepoId?: number;
  gitHubRepoName?: string;
  pushedAt?: string;
  createdAt?: string;
  stars?: number;
  forks?: number;
  isHidden?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level: string;
    description: string;
    highlight?: boolean;
  }[];
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  location: string;
  bio: string;
  availability: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface GitHubSyncConfig {
  username: string;
  autoSync: boolean;
  syncIntervalMinutes: number;
  excludeForks: boolean;
  token?: string;
  lastSyncedAt?: string;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  syncError?: string;
  totalReposFound?: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
}
