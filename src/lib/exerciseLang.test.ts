import { describe, expect, it } from 'vitest';
import { exerciseLang, exercisesForTarget } from './exerciseLang';

describe('exerciseLang', () => {
  it('reads the language prefix', () => {
    expect(exerciseLang('pt-PT-a1-food-001-mc-001')).toBe('pt-PT');
    expect(exerciseLang('a1-food-001')).toBeUndefined();
  });
  it('keeps only exercises written in the target language', () => {
    const ex = [
      { id: 'pt-PT-a1-food-001-mc-001', lessonId: 'A1-FOOD-001' },
      { id: 'de-DE-a1-food-001-mc-001', lessonId: 'A1-FOOD-001' },
    ];
    expect(exercisesForTarget(ex, 'de-DE').map((e) => e.id)).toEqual(['de-DE-a1-food-001-mc-001']);
    expect(exercisesForTarget(ex, 'fr-FR')).toEqual([]);
  });
});
