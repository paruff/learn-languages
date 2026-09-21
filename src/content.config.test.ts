import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Re-create the vocabulary item schema from content.config.ts for testing
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
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
  })
  .refine((data) => !data.imageUrl || !!data.imageAlt, {
    message: 'imageAlt is required whenever imageUrl is set (WCAG 2.1 AA — no unlabeled images)',
    path: ['imageAlt'],
  });

describe('Vocabulary Item Schema Validation', () => {
  const baseItem = {
    id: 'pt-PT-hello-001',
    term: 'Olá',
    translation: 'Hello',
    partOfSpeech: 'interjection' as const,
    example: 'Olá, como estás?',
    exampleTranslation: 'Hello, how are you?',
  };

  it('accepts a vocabulary item with no image at all', () => {
    const result = vocabularyItemSchema.safeParse(baseItem);
    expect(result.success).toBe(true);
  });

  it('accepts a vocabulary item with both imageUrl and imageAlt', () => {
    const result = vocabularyItemSchema.safeParse({
      ...baseItem,
      imageUrl: 'ola.webp',
      imageAlt: 'Two people waving hello to each other',
    });
    expect(result.success).toBe(true);
  });

  it('rejects imageUrl without imageAlt (would ship an unlabeled image)', () => {
    const result = vocabularyItemSchema.safeParse({
      ...baseItem,
      imageUrl: 'ola.webp',
    });
    expect(result.success).toBe(false);
  });
});

// Re-create the CEFR node schema from content.config.ts for testing
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

describe('CEFR Node Schema Validation', () => {
  describe('Valid CEFR nodes', () => {
    it('should accept a valid A1 node with all required fields', () => {
      const validNode = {
        nodeId: 'A1-GREET-001',
        cefrLevel: 'A1',
        skill: 'spoken_interaction',
        canDo: 'Can greet people and respond to greetings',
        pragmaticFocus: 'Use appropriate greeting for time of day and formality',
        notionalFocus: 'Time of day, formality register',
        relatedNodes: ['A1-GREET-002', 'A1-INTRO-001'],
        prerequisiteNodes: [],
      };

      const result = cefrNodeSchema.safeParse(validNode);
      expect(result.success).toBe(true);
    });

    it('should accept a minimal valid node with only required fields', () => {
      const minimalNode = {
        nodeId: 'A1-GREET-001',
        cefrLevel: 'A1',
        skill: 'spoken_interaction',
        canDo: 'Can greet people and respond to greetings',
      };

      const result = cefrNodeSchema.safeParse(minimalNode);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.relatedNodes).toEqual([]);
        expect(result.data.prerequisiteNodes).toEqual([]);
      }
    });

    it('should accept all valid CEFR levels', () => {
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      levels.forEach((level) => {
        const node = {
          nodeId: `${level}-TEST-001`,
          cefrLevel: level,
          skill: 'reading',
          canDo: 'Can read and understand simple texts.',
        };
        const result = cefrNodeSchema.safeParse(node);
        expect(result.success).toBe(true);
      });
    });

    it('should accept all valid skills', () => {
      const skills = ['listening', 'reading', 'spoken_interaction', 'spoken_production', 'writing'];
      skills.forEach((skill) => {
        const node = {
          nodeId: 'A1-TEST-001',
          cefrLevel: 'A1',
          skill,
          canDo: 'Can do something.',
        };
        const result = cefrNodeSchema.safeParse(node);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Invalid CEFR nodes', () => {
    it('should reject invalid nodeId format', () => {
      const invalidNode = {
        nodeId: 'A1-GREET', // missing 3-digit suffix
        cefrLevel: 'A1',
        skill: 'spoken_interaction',
        canDo: 'Can greet people.',
      };

      const result = cefrNodeSchema.safeParse(invalidNode);
      expect(result.success).toBe(false);
    });

    it('should reject invalid CEFR level', () => {
      const invalidNode = {
        nodeId: 'A0-TEST-001',
        cefrLevel: 'A0', // Invalid level
        skill: 'reading',
        canDo: 'Can read something.',
      };

      const result = cefrNodeSchema.safeParse(invalidNode);
      expect(result.success).toBe(false);
    });

    it('should reject invalid skill', () => {
      const invalidNode = {
        nodeId: 'A1-TEST-001',
        cefrLevel: 'A1',
        skill: 'speaking', // Not in enum
        canDo: 'Can speak.',
      };

      const result = cefrNodeSchema.safeParse(invalidNode);
      expect(result.success).toBe(false);
    });

    it('should reject canDo too short', () => {
      const invalidNode = {
        nodeId: 'A1-TEST-001',
        cefrLevel: 'A1',
        skill: 'reading',
        canDo: 'Short', // Less than 10 chars
      };

      const result = cefrNodeSchema.safeParse(invalidNode);
      expect(result.success).toBe(false);
    });

    it('should reject canDo too long', () => {
      const invalidNode = {
        nodeId: 'A1-TEST-001',
        cefrLevel: 'A1',
        skill: 'reading',
        canDo: 'A'.repeat(201), // More than 200 chars
      };

      const result = cefrNodeSchema.safeParse(invalidNode);
      expect(result.success).toBe(false);
    });

    it('should reject invalid nodeId prefix (wrong CEFR level)', () => {
      const invalidNode = {
        nodeId: 'B1-TEST-001', // B1 prefix but A1 level
        cefrLevel: 'A1',
        skill: 'reading',
        canDo: 'Can read simple texts.',
      };

      const result = cefrNodeSchema.safeParse(invalidNode);
      expect(result.success).toBe(false);
    });
  });

  describe('Defaults', () => {
    it('should default relatedNodes to empty array', () => {
      const node = {
        nodeId: 'A1-TEST-001',
        cefrLevel: 'A1',
        skill: 'reading',
        canDo: 'Can read simple texts.',
      };

      const result = cefrNodeSchema.safeParse(node);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.relatedNodes).toEqual([]);
      }
    });

    it('should default prerequisiteNodes to empty array', () => {
      const node = {
        nodeId: 'A1-TEST-001',
        cefrLevel: 'A1',
        skill: 'reading',
        canDo: 'Can read simple texts.',
      };

      const result = cefrNodeSchema.safeParse(node);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.prerequisiteNodes).toEqual([]);
      }
    });
  });
});

// Re-created from content.config.ts for testing (astro:content isn't
// importable outside Astro's Vite context — see the note on
// vocabularyItemSchema above).
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

describe('Exercise Schema Validation', () => {
  const baseExercise = {
    id: 'pt-PT-greetings-fill-blank-001',
    lessonId: 'A1-GREET-001',
    type: 'fill-blank' as const,
    prompt: 'Complete the greeting: "_____ dia!"',
    answer: 'Bom',
  };

  it('accepts a minimal valid fill-blank exercise', () => {
    const result = exerciseSchema.safeParse(baseExercise);
    expect(result.success).toBe(true);
  });

  it('accepts multiple-choice options', () => {
    const result = exerciseSchema.safeParse({
      ...baseExercise,
      type: 'multiple-choice',
      options: ['Boa tarde', 'Boa noite', 'Bom noite', 'Boa dia'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.options).toEqual(['Boa tarde', 'Boa noite', 'Bom noite', 'Boa dia']);
    }
  });

  it('accepts an audio URL for audio exercises', () => {
    const result = exerciseSchema.safeParse({
      ...baseExercise,
      type: 'audio',
      audio: '/audio/greetings_boatarte.mp3',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.audio).toBe('/audio/greetings_boatarte.mp3');
    }
  });

  it('requires lessonId to link the exercise to a CEFR node', () => {
    const withoutLessonId: Record<string, unknown> = { ...baseExercise };
    delete withoutLessonId.lessonId;
    const result = exerciseSchema.safeParse(withoutLessonId);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid exercise type', () => {
    const result = exerciseSchema.safeParse({ ...baseExercise, type: 'essay' });
    expect(result.success).toBe(false);
  });
});
