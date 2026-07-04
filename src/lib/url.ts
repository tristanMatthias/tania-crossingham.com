/**
 * Prefix an internal path with the configured base — required while the site
 * is served from a subpath (GitHub Pages project site). `url('/gallery/')`
 * → '/tania-crossingham.com/gallery/' there, '/gallery/' at a root domain.
 */
export function url(path: string): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}
