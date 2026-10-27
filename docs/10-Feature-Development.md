# Feature development

1. Define the user-visible behavior and security impact.
2. Add or update the smallest reusable component/page/data module.
3. Keep public content sanitized and use existing `sitePath()` helpers.
4. Add a structural or behavior test for validation and publishing logic.
5. Run `npm run check` and `npm audit --audit-level=high`.
6. Review the generated diff for secrets, personal data, and accidental
   changes to `public/`.

New integrations must have a documented failure mode and must not make the
static site unusable when unavailable.
