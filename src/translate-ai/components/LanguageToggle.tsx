import type { Language, TranslationCopy } from '../types';

interface LanguageToggleProps {
  language: Language;
  labels: Pick<TranslationCopy, 'french' | 'portuguese'>;
  onChange: (language: Language) => void;
}

export function LanguageToggle({ language, labels, onChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-slate-300 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange('fr')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
          language === 'fr' ? 'bg-slate-900 text-white' : 'text-slate-700'
        }`}
      >
        🇫🇷 {labels.french}
      </button>
      <button
        type="button"
        onClick={() => onChange('pt')}
        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
          language === 'pt' ? 'bg-slate-900 text-white' : 'text-slate-700'
        }`}
      >
        🇵🇹 {labels.portuguese}
      </button>
    </div>
  );
}
