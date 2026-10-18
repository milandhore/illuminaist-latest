// Resolve files from /public correctly on both a custom domain and a
// repository-based GitHub Pages URL such as /illuminaist-latest/.
export function sitePath(path = '') {
  const cleanPath = String(path).replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${cleanPath}`
}
