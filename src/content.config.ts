import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cefrNodeSchema = z
  .object({
    nodeId: z.string().regex(/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/),
    cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    skill: z.enum(['listening', 'reading', 'spoken_interaction', 'spoken_production', 'writing']),
    canDo: z.string().min(10).max(200),
    pragmaticFocus: z.string().optional(),
    notionalFocus: z.string().optional(),
    relatedNodes: z.array(z.string()).default([]),
    prerequisiteNodes: z.array(z.string()).default([]),
  })
  .refine((data) => data.nodeId.startsWith(`${data.cefrLevel}-`), {
    message: 'nodeId must start with the CEFR level (e.g., A1- for A1 level)',
    path: ['nodeId'],
  });

const vocabularyItemSchema = z
  .object({
    id: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?-.+-\d{3}$/),
    term: z.string().min(1),
    translation: z.string().min(1),
    partOfSpeech: z.enum([
      'noun',
      'verb',
      'adjective',
      'adverb',
      'pronoun',
      'preposition',
      'conjunction',
      'interjection',
      'phrase',
    ]),
    gender: z.enum(['masculine', 'feminine', 'neuter', 'n/a']).default('n/a'),
    example: z.string().min(5),
    exampleTranslation: z.string().min(5),
    audioUrl: z.string().optional(),
    // Filename relative to public/vocab-images/ (see CREDITS.md there for
    // sourcing/attribution) — not a full URL, so content authors don't need
    // to know the site's deployed base path.
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
  })
  .refine((data) => !data.imageUrl || !!data.imageAlt, {
    message: 'imageAlt is required whenever imageUrl is set (WCAG 2.1 AA — no unlabeled images)',
    path: ['imageAlt'],
  });

const grammarPointSchema = z.object({
  id: z.string(),
  point: z.string().min(5),
  explanation: z.string().min(20),
  examples: z.array(z.string()).min(1),
  cefrNotes: z.string().optional(),
});

const realisationSchema = z.object({
  nodeId: z.string(),
  lang: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
  vocabulary: z.array(vocabularyItemSchema).min(1),
  grammar: z.array(grammarPointSchema).default([]),
  culturalNotes: z.string().optional(),
});

const exerciseSchema = z.object({
  id: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?-.+-\d{3}$/),
  lessonId: z.string(),
  type: z.enum(['fill-blank', 'matching', 'multiple-choice', 'audio']),
  prompt: z.string().min(1),
  answer: z.union([z.string(), z.array(z.string())]),
  options: z.array(z.string()).optional(),
  audio: z.string().optional(),
  hints: z.array(z.string()).optional(),
});

export const collections = {
  'cefr-nodes': defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/cefr-nodes' }),
    schema: cefrNodeSchema,
  }),
  exercises: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/exercises' }),
    schema: exerciseSchema,
  }),
  vocab: defineCollection({
    type: 'data',
    schema: vocabularyItemSchema,
  }),
  realisations: defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/realisations' }),
    schema: realisationSchema,
  }),
};
