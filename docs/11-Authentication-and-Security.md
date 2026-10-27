# Authentication and security

The public static site has no authentication. A corporate email heuristic
rejects common free-mail domains, but it does not verify domain ownership and
must not protect confidential or paid content.

Security controls:

- No secret-bearing SDKs in the browser bundle.
- Subscriber records are not public build artifacts.
- CI uses read-only permissions, reproducible installs, dependency audit, and
  no install scripts.
- Production deployment is limited to `main`.
- Local CMS is bound to `127.0.0.1` and is not an internet-facing service.

For protected downloads, add a backend that authenticates the user, applies
rate limits, issues short-lived signed URLs, logs access safely, and enforces
authorization server-side.
