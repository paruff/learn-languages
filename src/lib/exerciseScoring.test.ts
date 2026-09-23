import { describe, it, expect } from 'vitest';
import { countScorableQuestions } from './exerciseScoring';

describe('countScorableQuestions', () => {
  it('counts one point per ordinary exercise', () => {
    const exercises = [{ type: 'fill-blank' }, { type: 'multiple-choice' }, { type: 'audio' }];
    expect(countScorableQuestions(exercises)).toBe(3);
  });

  it('counts a passage exercise as its number of sub-questions, not 1 (issue #125)', () => {
    const exercises = [{ type: 'fill-blank' }, { type: 'passage', questions: [{}, {}, {}] }];
    expect(countScorableQuestions(exercises)).toBe(4);
  });

  it('returns 0 for an empty exercise list', () => {
    expect(countScorableQuestions([])).toBe(0);
  });
});
