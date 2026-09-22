import type { CollectionEntry } from 'astro:content';

type Skill = CollectionEntry<'cefr-nodes'>['data']['skill'];

interface SkillIcon {
  viewBox: string;
  path: string;
}

// Single-path Material-style glyphs (24x24 viewBox), decorative only — the
// adjacent text label already carries the accessible name (issue #38).
const ICONS: Record<Skill, SkillIcon> = {
  listening: {
    viewBox: '0 0 24 24',
    path: 'M12 3a7 7 0 0 0-7 7v6a3 3 0 0 0 3 3h1v-8H6v-1a6 6 0 1 1 12 0v1h-3v8h1a3 3 0 0 0 3-3v-6a7 7 0 0 0-7-7Z',
  },
  reading: {
    viewBox: '0 0 24 24',
    path: 'M12 6c-1.8-1.2-4.1-2-6.5-2C4.1 4 3 4.4 3 5v13c1.5-.7 3-1 4.5-1 1.9 0 4.1.6 5.5 1.7V6Zm0 0c1.8-1.2 4.1-2 6.5-2 1.4 0 2.5.4 2.5 1v13c-1.5-.7-3-1-4.5-1-1.9 0-4.1.6-5.5 1.7',
  },
  spoken_interaction: {
    viewBox: '0 0 24 24',
    path: 'M8 12a7 7 0 1 1 3.2 5.9L4 20l1.4-3.9A6.9 6.9 0 0 1 8 12Zm10.5-6.5A6 6 0 0 1 22 11c0 1.5-.6 2.9-1.5 4l1 3-3-1a6 6 0 0 1-3.6.6',
  },
  spoken_production: {
    viewBox: '0 0 24 24',
    path: 'M12 4a8 8 0 1 0 3.9 15L20 20l-1.1-4.1A8 8 0 0 0 12 4Z',
  },
  writing: {
    viewBox: '0 0 24 24',
    path: 'M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4Zm11-14 3.5 3.5',
  },
};

export function getSkillIcon(skill: Skill): SkillIcon {
  return ICONS[skill];
}
