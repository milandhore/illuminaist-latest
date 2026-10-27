# Security policy

## Scope

IlluminAIst is a Vite/React static site deployed to GitHub Pages. The public
bundle contains only editorial content and client-side UI. It must not contain
API keys, private subscriber records, credentials, or authorization decisions.

## Reporting a vulnerability

Please email security@illuminaist.com with a clear description, reproduction
steps, impact, and any suggested mitigation. Do not open a public issue for a
suspected security vulnerability.

## Deployment guardrails

- GitHub Actions use least-privilege permissions and `npm ci --ignore-scripts`.
- Production deploys come from `main` only; pull requests are validated but not deployed.
- Secrets belong in GitHub Actions or a server-side integration, never in `VITE_*` variables.
- Subscriber records are local CMS data and are excluded from public artifacts.
- The static site cannot prove control of a corporate email domain. Corporate-email checks are UX gating only, not authentication or authorization.
- Any paid, private, or genuinely restricted eBook must be served by an authenticated backend or object-storage URL with short-lived access tokens.
