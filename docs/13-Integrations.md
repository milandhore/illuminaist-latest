# Integrations

- GitHub Pages: production static hosting through `.github/workflows/deploy.yml`.
- GitHub Actions: CI, deployment, scheduled editorial updates, and Dependabot.
- Google Fonts/AdSense: optional third-party browser resources; review consent,
  CSP, and privacy requirements before production activation.
- Optional subscription service: configured with `VITE_SUBSCRIPTION_API_URL`,
  with all secrets and email delivery kept server-side.

Third-party failures must degrade gracefully and must not expose credentials.
