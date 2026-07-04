import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Gallery rooms — the site is organised as a sequence of museum rooms.
 * Order determines the roman numeral shown on the room intro card.
 */
const galleries = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/galleries' }),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
    order: z.number(),
    /** aspect of thumbnails in the "all works" grid */
    gridAspect: z.enum(['portrait', 'landscape', 'square']).default('portrait'),
    /**
     * Curated, ordered list of the works shown in this room (drag-sortable
     * in the CMS). Accepts plain slugs or CMS-stored entry paths. Rooms
     * without a list fall back to showing all their works by `order`.
     */
    works: z
      .array(z.string())
      .default([])
      .transform((list) =>
        list.map((s) =>
          s
            .replace(/^\/?src\/content\/works\//, '')
            .replace(/\/index\.md$/, '')
            .replace(/^\.\//, ''),
        ),
      ),
  }),
});

/**
 * Artworks — one folder per work with its images co-located:
 *   src/content/works/<slug>/index.md + main.jpg + detail-N.jpg
 * Images go through astro:assets (optimized, responsive at build time).
 * The markdown body is optional "more details" text shown in the fullscreen
 * work view; works without a body just show the image.
 */
const works = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/works',
    generateId: ({ entry }) => entry.replace('/index.md', ''),
  }),
  schema: ({ image }) => {
    /**
     * Image values are stored in the CMS-canonical form
     * (src/content/works/<slug>/main.jpg — Pages CMS validates them against
     * its media root). The file always lives in the entry's own folder, so
     * normalizing to ./<basename> resolves it for astro:assets.
     */
    const workImage = z.preprocess(
      (v) => (typeof v === 'string' && !v.startsWith('./') ? `./${v.split('/').pop()}` : v),
      image(),
    );

    return z.object({
      title: z.string(),
      /**
       * The room this work hangs in. Pages CMS stores the gallery file name
       * (heraldry.yaml) — normalized here to the room slug. Plain slugs and
       * full paths are accepted too.
       */
      gallery: z
        .string()
        .transform((s) =>
          s
            .replace(/^\/?src\/content\/galleries\//, '')
            .replace(/\.ya?ml$/, ''),
        ),
      /** one-line caption, e.g. "Gouache & 23ct gold on vellum" */
      meta: z.string(),
      /** main image — shown in strips, grids and first in the work view */
      image: workImage,
      /** additional images (details, closeups) shown in the work view */
      images: z.array(workImage).default([]),
      /** show in the homepage strip */
      featured: z.boolean().default(false),
      order: z.number().default(99),
    });
  },
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    /** e.g. "Book cover", "Workshop student" */
    context: z.string(),
    order: z.number().default(99),
  }),
});

/**
 * Editorial pages (about / commissions / workshops / contact).
 * Body is markdown, rendered through the shared editorial layout.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { galleries, works, testimonials, pages };
