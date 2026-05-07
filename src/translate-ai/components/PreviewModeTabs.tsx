import type { PreviewMode, TranslationCopy } from '../types';

interface PreviewModeTabsProps {
  mode: PreviewMode;
  labels: Pick<TranslationCopy, 'translation' | 'gt' | 'sideBySide'>;
  onChange: (mode: PreviewMode) => void;
}

export function PreviewModeTabs({ mode, labels, onChange }: PreviewModeTabsProps) {
  return (
    <div className="inline-flex rounded-xl border border-slate-300 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange('translation')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
          mode === 'translation' ? 'bg-slate-900 text-white' : 'text-slate-700'
        }`}
      >
        {labels.translation}
      </button>
      <button
        type="button"
        onClick={() => onChange('gt')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
          mode === 'gt' ? 'bg-slate-900 text-white' : 'text-slate-700'
        }`}
      >
        {labels.gt}
      </button>
      <button
        type="button"
        onClick={() => onChange('split')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
          mode === 'split' ? 'bg-slate-900 text-white' : 'text-slate-700'
        }`}
      >
        {labels.sideBySide}
      </button>
    </div>
  );
}
