# Project Instructions & Persistent Agent Directives

## Mandate: Zero-Manual-Work GitHub Actions Publishing & Deployment

All features, components, and code developed for this project must remain **readily publishable to GitHub Actions and GitHub Pages with zero manual intervention required by the developer**.

### 1. Automated CI/CD Deployment Standard
- **Workflow File**: Maintain `/.github/workflows/deploy.yml` with the official GitHub Pages deployment actions (`actions/checkout@v4`, `actions/setup-node@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`).
- **Triggers**: Automated build & deploy on `push` to `main` and `master`, plus manual `workflow_dispatch`.
- **Lockfile Resiliency**: Keep `package-lock.json` committed in the root repository. In `actions/setup-node@v4`, avoid rigid `cache: 'npm'` options that fail the build if a lockfile is omitted; instead use resilient dependency installation (`if [ -f package-lock.json ]; then npm ci; else npm install; fi`).
- **Zero Config Required**: The repository owner only needs to set GitHub Pages Source to **"GitHub Actions"** in repository settings once; every subsequent push deploys automatically without writing custom scripts, Dockerfiles, or manual build steps.

### 2. Static Hosting & Base Path Compatibility
- **Relative Asset Paths**: `vite.config.ts` must maintain `base: './'` so that assets, styles, fonts, and scripts load properly whether deployed at the root domain (`example.com`), user domain (`username.github.io`), or repository subpath (`username.github.io/repository-name/`). Never hardcode absolute root paths like `/assets/`.
- **Static SPA Output**: All code must build cleanly to `/dist` using `npm run build`. Never introduce mandatory server-side runtime dependencies that break static CDN hosting.

### 3. Verification & Build Cleanliness
- **Strict Lint & Typecheck**: Every commit or feature must pass `npm run lint` (`tsc --noEmit`) and `npm run build` with zero TypeScript errors or missing imports.
- **Dependency Hygiene**: Any newly added package must be declared in `package.json` with explicit semver and compatible with modern Node.js (v20+).

### 4. Client-Side Resiliency & Data Persistence
- **API Gracefulness**: Any external integrations (such as GitHub REST API queries) must execute client-side with robust error handling, rate-limit warnings, and local caching in `localStorage`. The app must remain 100% interactive even in offline or rate-limited environments.
