# Product requirements

IlluminAIst is an independent AI engineering publication for builders. It
offers practical articles, current AI news, topic discovery, engineering
eBooks, and opt-in local subscription UX.

## Requirements

- Fast, accessible, responsive pages for home, articles, news, eBooks, about,
  subscribe, privacy, and terms.
- Static content must build without a runtime database or server.
- Article and news content must remain linkable and searchable by slug.
- eBook downloads remain available in the current product flow, while real
  access control is explicitly delegated to a future backend.
- Editorial publishing must be possible from the local CMS without exposing
  CMS endpoints in the public deployment.

## Non-goals

GitHub Pages cannot provide server-side email delivery, authentication, rate
limiting, secret storage, or paid-content authorization. Those require a
separate trusted service.
