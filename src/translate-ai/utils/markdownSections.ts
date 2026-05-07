import type { SplitMarkdown } from '../types';

export function splitNumberedSections(content: string): SplitMarkdown {
  const headingPattern = /^##\s+(\d+)\.\s+.*$/gm;
  const matches = [...content.matchAll(headingPattern)];

  if (matches.length === 0) {
    return { intro: content.trim(), sections: new Map() };
  }

  const sections = new Map<number, string>();
  const intro = content.slice(0, matches[0].index).trim();

  matches.forEach((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? content.length;
    const sectionNumber = Number(match[1]);

    if (Number.isFinite(sectionNumber)) {
      sections.set(sectionNumber, content.slice(start, end).trim());
    }
  });

  return { intro, sections };
}
