import { defineCollection, z } from 'astro:content';

export const collections = {
  lessons: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      cefr: z.string(),
      module: z.string(),
      order: z.number(),
      audio: z.string(),
      tags: z.array(z.string()),
    }),
  }),
  exercises: defineCollection({
    type: 'data',
    schema: z.object({
      lessonId: z.string(),
      type: z.enum(['fill-blank', 'matching', 'multiple-choice', 'audio']),
      prompt: z.string(),
      answer: z.union([z.string(), z.array(z.string())]),
      hints: z.array(z.string()).optional(),
    }),
  }),
  vocab: defineCollection({
    type: 'data',
    schema: z.object({
      word: z.string(),
      translation: z.string(),
      cefr: z.string(),
      tags: z.array(z.string()),
      audio: z.string().optional(),
    }),
  }),
};
