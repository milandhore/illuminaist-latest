# Architecture

The React app starts at `src/main.jsx`, renders `App`, and routes through the
layout and lazy-loaded pages. Reusable UI, hooks, local data, and public assets
remain separated by responsibility.

GitHub Actions runs a reproducible install and Vite build, then uploads `dist`
to GitHub Pages. The local CMS writes editorial files for review; it is never
deployed as a public Node service.

The production site uses `HashRouter` so repository-based GitHub Pages deep
links work without server rewrite rules. `sitePath()` resolves public assets
against Vite's configured base URL.
