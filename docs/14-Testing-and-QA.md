# Testing and QA

`npm run check` runs the structural Node test suite and the production Vite
build. CI also runs `npm audit --audit-level=high`.

Manual release checklist:

- Test home, article, news, eBook, subscribe, privacy, and terms routes.
- Test repository-path deployment, refreshes, asset URLs, mobile layout, and
  light/dark mode.
- Verify no API keys, subscriber records, `.env` files, or CMS endpoints are
  present in `dist/`.
- Test keyboard navigation and reduced-motion behavior.
- Confirm the Pages environment and custom-domain DNS settings in GitHub.
