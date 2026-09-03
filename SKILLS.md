# GitHub Actions Automated Deployment & Publishing Skill

## Overview
This document specifies the automated GitHub Actions CI/CD publishing pipeline and architectural constraints for this developer portfolio web application. All current and future development must strictly comply with this blueprint to ensure that the repository remains 100% turnkey and publishable to GitHub Pages with minimal to no manual intervention.

---

## 1. Automated Workflow Pipeline (`.github/workflows/deploy.yml`)

The repository includes a ready-to-run GitHub Actions workflow configured for modern GitHub Pages deployment:

- **Trigger Events**:
  - Automatically runs on any push to the `main` or `master` branches.
  - Supports `workflow_dispatch` for manual one-click deployments directly from the GitHub Actions web interface.
- **Security & Permissions**:
  - `contents: read` to safely checkout repository files.
  - `pages: write` and `id-token: write` for OIDC authentication with GitHub Pages deployment infrastructure.
- **Concurrency Management**:
  - Group `pages` with `cancel-in-progress: false` ensures zero race conditions during deployment rollout.
- **Build & Packaging Job**:
  - Sets up Node.js v20 via `actions/setup-node@v4` without rigid cache locks to prevent "Dependencies lock file is not found" errors.
  - Installs dependencies using `package-lock.json` (`npm ci`) or fallback `npm install`.
  - Runs full TypeScript typechecking via `npm run lint`.
  - Compiles the production bundle to `dist/` via `npm run build`.
  - Uploads the static artifact using `actions/upload-pages-artifact@v3`.
- **Deploy Job**:
  - Publishes the artifact live using `actions/deploy-pages@v4` with automatic deployment URL reporting.

---

## 2. Zero-Configuration Repository Setup Guide

To publish this portfolio to the web, the developer only needs to follow these two quick steps:

1. **Push the repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - In your repository on GitHub, navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
   - **No further steps or manual builds are required.** The deployment workflow will trigger automatically and publish your site at `https://<username>.github.io/<repo-name>/`.

---

## 3. Core Architectural Rules for Future Development

Whenever extending or modifying this application:

1. **Keep Base URL Relative (`base: './'`)**:
   - The `vite.config.ts` configuration must always maintain `base: './'`.
   - This prevents 404 errors for JavaScript, CSS, and image assets when hosted inside repository subfolders (e.g., `username.github.io/portfolio/`).

2. **Pure Static Deliverable**:
   - The application is a high-performance single-page application (SPA).
   - Any external operations (such as syncing public repositories from GitHub or exporting portfolio data) must operate entirely client-side with proper rate-limit fallbacks and `localStorage` caching.
   - Do not require server runtimes or backend API proxies to view the portfolio.

3. **Continuous Build Verification**:
   - Before completing any task, always verify that `npm run lint` (`tsc --noEmit`) and `npm run build` succeed with zero errors.
   - Never commit unresolved TypeScript discrepancies or missing icon imports.
