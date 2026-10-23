import { computeRetention, computeReturn, summariseLog, type GradeEntry } from './gradeLog';

interface ReportInput {
  sourceLang: string;
  targetLang: string;
  log: GradeEntry[];
  levels: { cefrLevel: string; masteredItems: number; totalItems: number }[];
  comment: string;
  generatedOn: string;
}

/**
 * Learner-initiated summary (spec M1). Counts and dates only: no item ids, no
 * card text, no identifiers. The learner reads it and sends it themselves.
 */
export function buildSessionReport(input: ReportInput): string {
  const summary = summariseLog(input.log);
  const data = {
    app: 'Acquira',
    generatedOn: input.generatedOn,
    pair: `${input.sourceLang} → ${input.targetLang}`,
    reviews: summary.reviews,
    daysActive: summary.daysActive,
    firstDay: summary.firstDay,
    lastDay: summary.lastDay,
    gradeMix: summary.gradeMix,
    retention: computeRetention(input.log),
    returned: computeReturn(input.log),
    levels: input.levels,
    comment: input.comment.trim(),
  };
  return `Acquira session report (${data.generatedOn})\nSent by the learner, nothing else is shared.\n\n${JSON.stringify(data, null, 2)}`;
}
