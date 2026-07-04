# tania-crossingham.com

Portfolio site for Tania Crossingham — illuminator, calligrapher and painter.

**Stack:** [Astro](https://astro.build) (fully static output) · [Pages CMS](https://pagescms.org) (git-backed editing) · [Cloudflare Pages](https://pages.cloudflare.com) (hosting)

The public site ships zero framework JavaScript — plain HTML/CSS plus a ~2 KB
vanilla script for the gallery strip interactions.

## Development

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static output in dist/
```

## How the site is organised

```
src/styles/tokens.css    ← design tokens (colours, type, spacing) — single source of truth
src/styles/global.css    ← base styles, shared text/button classes
src/components/          ← Header, Footer, WorkStrip, CtaPanel, RoomIntro, TestimonialCard
src/layouts/Base.astro   ← page shell (strip pages lock to viewport; editorial pages scroll)
src/pages/               ← routes (homepage strip, gallery rooms, kind words, editorial pages)
src/content/             ← ALL editable content (see below)
.pages.yml               ← the Pages CMS schema — defines every form Tania sees
```

### Content model

| Collection | Where | What |
|---|---|---|
| Artworks | `src/content/works/<slug>/index.md` | one **folder per work with its images co-located** (`main.jpg`, `detail-N.jpg`); frontmatter: title, gallery room, caption, image, more images — plus an optional **"More details"** rich-text body (the story, materials, dimensions). Images are optimized at build time via `astro:assets` |
| Gallery rooms | `src/content/galleries/*.yaml` | room name, intro, room number (roman numeral), thumbnail shape |
| Pages | `src/content/pages/*.md` | About / Commissions / Workshops / Contact — intro + rich text body |
| Kind words | `src/content/testimonials/*.yaml` | quote, name, context, order |
| Homepage | `src/content/homepage.json` | quote card + commission panel text, and the **ordered list of works in the strip** |
| Site settings | `src/content/settings.json` | name, credentials line, location, email, social links |

Content is validated against the schema in `src/content.config.ts` at build
time — a malformed entry fails the build rather than shipping a broken page.

Curation is done with drag-sortable reference lists in the CMS: each gallery
room lists its works in order, the homepage lists its strip works, and site
settings lists the nav pages.

### Work pages / fullscreen view

Every artwork has its own URL (`/gallery/<room>/<work>/`) rendered as the room
page with a fullscreen view open — so works are directly linkable, browser
back/forward steps between them (`pushState`/`popstate`), and no-JS visitors
still get the full page. Clicking any gallery image opens the view in place;
works with a "More details" body get a scrollable story section under the
full-width image; Esc / ← / → work from the keyboard. See
[WorkView.astro](src/components/WorkView.astro).

### Design rules

- Components reference tokens (`var(--color-gold)` etc.), never raw values.
- Content editors cannot touch design: they edit fields defined in `.pages.yml`;
  layout and styles live only in templates.
- The full catalogue (~215 works across Medieval, Heraldry, Contemporary,
  Commissions and Illuminated Letters) was imported from the old
  tania-crossingham.com — titles, descriptions, mediums, dimensions and images.
  Images are the old site's web-resolution CDN copies (~300–1100 px wide);
  replace individual works with high-res scans via the CMS media library when
  available.

## Editing (for Tania)

Content is edited at **https://app.pagescms.org** — no GitHub account needed:

1. Tristan invites your email address as a collaborator.
2. You receive a link, log in via the emailed magic link.
3. Edit artworks, pages, quotes or settings in plain forms; press **Save**.
4. The site rebuilds and is live a minute later.

You can't break anything: every save is a git commit (fully undoable), and the
design itself is not editable.

## Deployment (one-time setup)

1. Push this repo to GitHub.
2. **Cloudflare Pages** → Create project → connect the repo.
   Framework preset **Astro**, build command `pnpm build`, output `dist`.
3. Point the `tania-crossingham.com` DNS at Cloudflare Pages.
4. **Pages CMS**: sign in at app.pagescms.org with the GitHub account that owns
   the repo, open the repo (it reads `.pages.yml`), then invite Tania by email
   under Settings → Collaborators.

> Verify on first CMS login: create a test artwork and confirm the `gallery`
> reference stores the room's file slug (e.g. `contemporary`) — that's what
> Astro's schema expects. Adjust the `value` template on the reference field in
> `.pages.yml` if needed.

## Design reference

The original Claude Design project lives at
[claude.ai/design](https://claude.ai/design/p/304f2636-040e-4124-89f4-8ebc06e734c9)
(exports in `design/`, git-ignored). Extracted markup used to build the design
system is in `design/clean/`.
