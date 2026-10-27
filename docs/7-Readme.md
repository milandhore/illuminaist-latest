# Repository guide

- `src/`: React application, routes, components, hooks, and data.
- `public/`: static assets, article HTML, PDFs, robots, and security metadata.
- `tools/`: local CMS and editorial automation; never deployed as an API.
- `tests/`: Node-based structural tests.
- `docs/`: product, technical, security, and operations documentation.
- `.github/`: CI, GitHub Pages deployment, dependency updates, and ownership.

The production branch is `main`. Pull requests run CI; only `main` deploys to
GitHub Pages.
