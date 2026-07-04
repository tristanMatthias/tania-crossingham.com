import { defineCollection, reference, z } from 'astro:content';
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
  }),
});

/**
 * Artworks. The markdown body is optional "more details" text shown in the
 * fullscreen work view; works without a body just show the image.
 */
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    gallery: reference('galleries'),
    /** one-line caption, e.g. "Gouache & 23ct gold on vellum" */
    meta: z.string(),
    /** main image — shown in strips, grids and first in the work view */
    image: z.string(),
    /** additional images (details, closeups) shown in the work view */
    images: z.array(z.string()).default([]),
    /** show in the homepage strip */
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
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
