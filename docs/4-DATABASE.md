# Data and storage

The static build has no production database.

- Editorial data: `src/data/*.js` and generated HTML under `public/articles/`.
- Public alert feed: `src/data/alerts.json` and `public/alerts.json`.
- Local subscription preference: browser `localStorage` only.
- Local CMS subscriber store: `src/data/subscribers.json`; it is ignored by
  Git and must never be copied into `public/`.

Never commit real subscriber records, access tokens, passwords, or API keys.
If durable subscriptions are needed, use a server-side provider with consent,
retention, deletion, and access controls.
