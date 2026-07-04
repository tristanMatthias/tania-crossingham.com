// @ts-check
import { defineConfig } from 'astro/config';

// Deployment target is configurable — the default is the real domain at the
// root path. The temporary GitHub Pages deploy overrides these via env vars
// in .github/workflows/deploy.yml (project sites serve from a subpath).
// All internal links go through src/lib/url.ts, so they adapt automatically.
const site = process.env.SITE_URL ?? 'https://tania-crossingham.com';
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({ site, base });
