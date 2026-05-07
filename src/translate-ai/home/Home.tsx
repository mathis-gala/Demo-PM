import { useMemo, useState } from 'react';
import { DetailsPanel } from '../components/DetailsPanel';
import { LanguageToggle } from '../components/LanguageToggle';
import { MarkdownPanel } from '../components/MarkdownPanel';
import { ModelSelector } from '../components/ModelSelector';
import { PreviewModeTabs } from '../components/PreviewModeTabs';
import { SplitMarkdownComparison } from '../components/SplitMarkdownComparison';
import { copy } from '../data/copy';
import { englishGt, getFileContent } from '../data/markdownFiles';
import { filenameForLanguage, MODELS } from '../data/models';
import type { ComparedMetrics, Language, PreviewMode } from '../types';
import { computeScore, getMetrics } from '../utils/metrics';

export default function Home() {
  const [language, setLanguage] = useState<Language>('fr');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('split');
  const [selectedModelName, setSelectedModelName] = useState<string>(MODELS[0]?.name ?? '');
  const t = copy[language];
  const gtMetrics = useMemo(() => getMetrics(englishGt), []);

  const study = useMemo<ComparedMetrics[]>(() => {
    return MODELS.map((model) => {
      const translation = getFileContent(filenameForLanguage(model, language)) ?? '';
      const metrics = getMetrics(translation);
      return { model, translation, metrics, score: computeScore(metrics, gtMetrics) };
    });
  }, [language, gtMetrics]);

  const selected = study.find((row) => row.model.name === selectedModelName) ?? study[0];

  return (
    <div className="min-h-full bg-[#f4f7fb] text-slate-900">
      <div className="mx-auto max-w-[1500px] px-6 py-10">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{t.subtitle}</p>
          </div>
          <LanguageToggle language={language} labels={t} onChange={setLanguage} />
        </div>

        <div className="mb-6 grid gap-4">
          <ModelSelector
            englishGt={englishGt}
            labels={t}
            rows={study}
            selectedModelName={selected?.model.name ?? ''}
            onSelect={setSelectedModelName}
          />

          {selected ? <DetailsPanel labels={t} selected={selected} /> : null}
        </div>

        <div className="mb-4 flex justify-center">
          <PreviewModeTabs mode={previewMode} labels={t} onChange={setPreviewMode} />
        </div>

        {selected ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {previewMode === 'translation' ? (
              <div className="mx-auto w-full max-w-[760px]">
                <MarkdownPanel
                  title={`${t.preview} (${language.toUpperCase()}) \u00b7 ${selected.model.name}`}
                  content={selected.translation}
                />
              </div>
            ) : null}
            {previewMode === 'gt' ? (
              <div className="mx-auto w-full max-w-[760px]">
                <MarkdownPanel title={t.gt} content={englishGt} />
              </div>
            ) : null}
            {previewMode === 'split' ? (
              <SplitMarkdownComparison
                gtContent={englishGt}
                gtTitle={t.gt}
                translationContent={selected.translation}
                translationTitle={`${t.translation} (${selected.model.name})`}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
