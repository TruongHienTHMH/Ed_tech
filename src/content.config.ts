import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const common = z.object({
  title: z.string(),
  summary: z.string(),
  category: z.string(),
  order: z.number().default(99),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  image: z.string().optional()
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/courses' }),
  schema: common.extend({
    duration: z.string(),
    level: z.string(),
    mentor: z.string(),
    outcomes: z.array(z.string()).default([])
  })
});

const roadmaps = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/roadmaps' }),
  schema: common.extend({
    duration: z.string(),
    steps: z.array(z.string()).min(1)
  })
});

const mentors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/mentors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    order: z.number().default(99),
    published: z.boolean().default(true),
    image: z.string().optional()
  })
});

export const collections = { courses, roadmaps, mentors };
