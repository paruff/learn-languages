import { describe, it, expect } from 'vitest';
import { getSkillIcon } from './skillIcon';

const SKILLS = [
  'listening',
  'reading',
  'spoken_interaction',
  'spoken_production',
  'writing',
] as const;

describe('getSkillIcon', () => {
  it('returns a non-empty SVG path and viewBox for every skill enum value', () => {
    for (const skill of SKILLS) {
      const icon = getSkillIcon(skill);
      expect(icon.path.length).toBeGreaterThan(0);
      expect(icon.viewBox).toBe('0 0 24 24');
    }
  });

  it('returns a distinct path for each skill (no two skills share an icon)', () => {
    const paths = SKILLS.map((skill) => getSkillIcon(skill).path);
    expect(new Set(paths).size).toBe(SKILLS.length);
  });
});
