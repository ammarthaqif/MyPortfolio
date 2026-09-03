import { UserProfile, SkillCategory } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Ammar Thaqif',
  role: 'Full-Stack Engineer & AI App Developer',
  email: 'ammarthaqif.ar@gmail.com',
  location: 'Available Globally (Remote)',
  bio: 'Full-stack software engineer specialized in designing, building, and deploying AI-augmented web applications, high-performance client tools, and modern reactive interfaces. Committed to rigorous craftsmanship, responsive design systems, and rapid delivery of production-ready software.',
  availability: 'Available for Select Projects & Roles',
  github: 'https://github.com/ammarthaqif',
  linkedin: 'https://linkedin.com/in/ammarthaqif',
  twitter: 'https://x.com/ammarthaqif',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend & Reactive UI',
    description: 'Engineering responsive, accessible, and fast browser interfaces with modern design systems.',
    skills: [
      { name: 'React 19 & TypeScript', level: 'Production Expert', description: 'Concurrent features, custom hooks, strict typing', highlight: true },
      { name: 'Tailwind CSS & Design Systems', level: 'Advanced', description: 'Fluid responsiveness, bespoke color mathematics, zero-slop UI', highlight: true },
      { name: 'State Management & Canvas', level: 'Proficient', description: 'Zustand, React Context, HTML5 Canvas 2D / WebGL rendering' },
      { name: 'Motion & Animation', level: 'Proficient', description: 'Framer Motion / Motion, micro-interactions, layout morphs' },
    ],
  },
  {
    title: 'AI & Multimodal Systems',
    description: 'Integrating foundation models, prompt engineering pipelines, and grounded evaluation.',
    skills: [
      { name: 'Gemini API & SDKs', level: 'Advanced', description: 'Multimodal vision, function calling, streaming, structured outputs', highlight: true },
      { name: 'Context Engineering & RAG', level: 'Advanced', description: 'Vector embeddings, chunking strategies, deterministic evals', highlight: true },
      { name: 'Prompt Architecture', level: 'Expert', description: 'Zero/few-shot system prompts, JSON schema enforcement' },
      { name: 'Local & Server AI Proxies', level: 'Production', description: 'Secure server-side API credential isolation, rate limiting' },
    ],
  },
  {
    title: 'Backend, APIs & Architecture',
    description: 'Building reliable server endpoints, real-time channels, and database workflows.',
    skills: [
      { name: 'Node.js & Express / Fastify', level: 'Advanced', description: 'RESTful endpoints, middleware chains, async pipeline scaling', highlight: true },
      { name: 'Databases & Schemas', level: 'Proficient', description: 'PostgreSQL, Firestore, Redis caching, SQL query optimization' },
      { name: 'Realtime & WebSockets', level: 'Proficient', description: 'Bidirectional sync, presence detection, optimistic updates' },
      { name: 'Auth & Security', level: 'Proficient', description: 'OAuth2 / GSI, JWT verification, RBAC rules & sanitization' },
    ],
  },
  {
    title: 'Tooling & Deployment',
    description: 'Toolchains that ensure fast builds, reliable testing, and clean containerized deployments.',
    skills: [
      { name: 'Vite & Build Tooling', level: 'Advanced', description: 'Asset bundling, ES modules, tree shaking, SSR setups', highlight: true },
      { name: 'Docker & Cloud Run', level: 'Proficient', description: 'Containerized deployment, scale-to-zero microservices' },
      { name: 'Git & CI/CD Pipelines', level: 'Advanced', description: 'Automated linting, bundle size checks, semantic releases' },
      { name: 'Web Standards & Performance', level: 'Advanced', description: 'Core Web Vitals, WCAG AA accessibility, latency profiling' },
    ],
  },
];
