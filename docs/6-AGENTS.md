# Agent and automation guidance

- Read `SECURITY.md` before changing deployment, subscriptions, publishing, or
  credentials.
- Prefer small, reviewable patches and preserve unrelated user changes.
- Never put secrets in source, `public/`, `VITE_*` variables, screenshots, or
  commit messages.
- Run `npm run check` after application changes.
- Do not run content mutation scripts as a validation step; some update files
  and alerts by design.
- Treat client-side subscription flags as UX state, never as authorization.
