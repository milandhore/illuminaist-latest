# Project implementation

The application uses React 18, Vite, React Router, Framer Motion, Tailwind
CSS, and Lucide icons. Content is split from presentation, route screens are
lazy-loaded, and static assets are addressed through `sitePath()`.

The deployment workflow builds `dist/`, uploads it as a Pages artifact, and
deploys through the official Pages actions. It does not run the CMS or expose
Node services.
