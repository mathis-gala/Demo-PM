import { formatTime } from '../../utils/formatTime';
import type { ComparedMetrics, TranslationCopy } from '../types';
import { estimatePrice } from '../utils/pricing';

interface ModelSelectorProps {
  englishGt: string;
  rows: ComparedMetrics[];
  selectedModelName: string;
  labels: Pick<
    TranslationCopy,
    'input' | 'output' | 'perMillion' | 'avgTime' | 'estimatedPrice' | 'score'
  >;
  onSelect: (modelName: string) => void;
}

export function ModelSelector({
  englishGt,
  rows,
  selectedModelName,
  labels,
  onSelect,
}: ModelSelectorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map((row) => (
          <button
            key={row.model.name}
            type="button"
            onClick={() => onSelect(row.model.name)}
            className={`rounded-xl border p-4 text-left transition ${
              selectedModelName === row.model.name
                ? 'border-slate-900 bg-slate-100 shadow-sm'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <p className="text-base font-semibold">{row.model.name}</p>
            <p className="mt-2 text-xs text-slate-600">
              {labels.input} ${row.model.inputPrice}
              {labels.perMillion} {'\u00b7'} {labels.output} ${row.model.outputPrice}
              {labels.perMillion}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {labels.avgTime}: {formatTime(row.model.avgTimeInSeconds * 1_000)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {labels.estimatedPrice}: $
              {estimatePrice(row.model, englishGt, row.translation).toFixed(4)}
            </p>
            <p className="mt-3 text-sm font-medium">
              {labels.score}: <span className="font-semibold">{row.score}/100</span>
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
