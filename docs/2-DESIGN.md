# Design system and UX

- React components live under `src/components`; route-level screens live under
  `src/pages`.
- Tailwind utility classes and `src/index.css` define the visual system.
- Preserve keyboard focus, readable contrast, semantic headings, labelled
  controls, reduced-motion compatibility, and mobile layouts.
- Keep data-fetching states explicit: loading, success, empty, and error.
- Subscription UI must not claim that an email domain has been verified by the
  site; client-side domain checks are only a convenience gate.
