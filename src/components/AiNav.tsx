const baseButtonClass =
  'w-[200px] rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800';

interface AiNavProps {
  onSelect: (view: 'classification' | 'translation') => void;
}

export default function AiNav({ onSelect }: AiNavProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <button type="button" onClick={() => onSelect('classification')} className={baseButtonClass}>
        AI Classification Idea
      </button>
      <button type="button" onClick={() => onSelect('translation')} className={baseButtonClass}>
        AI Text Translation
      </button>
    </div>
  );
}
