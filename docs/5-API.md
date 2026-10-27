# API contract

The deployed GitHub Pages site has no API. The optional
`VITE_SUBSCRIPTION_API_URL` can point to a separately hosted service exposing:

```http
POST /subscribe
Content-Type: application/json

{"email":"person@example.com","domain":"example.com","isCompany":true,"source":"website"}
```

The browser sends no credentials and no secret. The service must provide its
own CORS allowlist, validation, abuse controls, rate limits, consent handling,
deduplication, and email provider integration. Do not use the local CMS as a
public production API.
