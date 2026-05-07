import type { ComparedMetrics, TranslationCopy } from '../types';

interface DetailsPanelProps {
  selected: ComparedMetrics;
  labels: Pick<
    TranslationCopy,
    | 'details'
    | 'chars'
    | 'lines'
    | 'headings'
    | 'lists'
    | 'links'
    | 'placeholders'
    | 'scoreHelpTitle'
    | 'scoreHelp'
    | 'priceHelpTitle'
    | 'priceHelp'
    | 'docs'
  >;
}

export function DetailsPanel({ selected, labels }: DetailsPanelProps) {
  return (
    <aside className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{labels.details}</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700">
        <p>
          {labels.chars}: {selected.metrics.charCount}
        </p>
        <p>
          {labels.lines}: {selected.metrics.lineCount}
        </p>
        <p>
          {labels.headings}: {selected.metrics.headingCount}
        </p>
        <p>
          {labels.lists}: {selected.metrics.listCount}
        </p>
        <p>
          {labels.links}: {selected.metrics.linkCount}
        </p>
        <p>
          {labels.placeholders}: {selected.metrics.placeholderCount}
        </p>
      </div>
      <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{labels.scoreHelpTitle}</p>
        <p className="mt-1">{labels.scoreHelp}</p>
      </div>
      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{labels.priceHelpTitle}</p>
        <p className="mt-1">{labels.priceHelp}</p>
      </div>
      <a
        href={selected.model.link}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        {labels.docs}
      </a>
    </aside>
  );
}
