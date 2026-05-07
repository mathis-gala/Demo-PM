import { splitNumberedSections } from '../utils/markdownSections';
import { MarkdownBlock } from './MarkdownPanel';

interface SplitMarkdownComparisonProps {
  gtContent: string;
  gtTitle: string;
  translationContent: string;
  translationTitle: string;
}

export function SplitMarkdownComparison({
  gtContent,
  gtTitle,
  translationContent,
  translationTitle,
}: SplitMarkdownComparisonProps) {
  const translation = splitNumberedSections(translationContent);
  const gt = splitNumberedSections(gtContent);
  const sectionNumbers = [...new Set([...translation.sections.keys(), ...gt.sections.keys()])].sort(
    (a, b) => a - b
  );
  const hasIntro = translation.intro.length > 0 || gt.intro.length > 0;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <p className="min-w-0 text-lg font-semibold">{translationTitle}</p>
        <p className="min-w-0 text-lg font-semibold">{gtTitle}</p>
      </div>

      {hasIntro ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <MarkdownBlock content={translation.intro} />
          <MarkdownBlock content={gt.intro} />
        </div>
      ) : null}

      {sectionNumbers.map((sectionNumber) => (
        <div
          key={sectionNumber}
          className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        >
          <MarkdownBlock content={translation.sections.get(sectionNumber) ?? ''} />
          <MarkdownBlock content={gt.sections.get(sectionNumber) ?? ''} />
        </div>
      ))}
    </div>
  );
}
