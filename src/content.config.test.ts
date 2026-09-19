import { describe, it, expect } from 'vitest';
import { z } from 'zod';

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
