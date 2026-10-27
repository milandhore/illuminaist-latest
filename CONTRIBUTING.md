# Contributing

## Local workflow

```bash
npm ci
npm run dev
```

Before opening a pull request, run:

```bash
npm run check
npm audit --audit-level=high
```

Keep changes focused, do not commit `dist/`, `.env` files, subscriber data, or
credentials, and add a regression test when changing validation or publishing
logic. Content changes should be reviewed for source attribution, dates, links,
and safe HTML rendering.

## Pull requests

Describe the user-visible change, security/privacy impact, and verification
performed. Production deployment is restricted to the `main` branch after CI
passes.
