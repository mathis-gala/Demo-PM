import { useMemo, useState } from "react";
import "github-markdown-css/github-markdown-light.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatTime } from "../../utils/formatTime";
import { GPT54Mini, GPT54Nano, GPT5mini, type TranslationModel } from "../res/model";

type Language = "fr" | "pt";
type PreviewMode = "translation" | "gt" | "split";

interface StructuralMetrics {
  charCount: number;
  lineCount: number;
  headingCount: number;
  listCount: number;
  linkCount: number;
  placeholderCount: number;
}

interface ComparedMetrics {
  model: TranslationModel;
  translation: string;
  metrics: StructuralMetrics;
  score: number;
}

interface SplitMarkdown {
  intro: string;
  sections: Map<number, string>;
}

const MODELS: TranslationModel[] = [GPT54Mini, GPT5mini, GPT54Nano];
const markdownFiles = import.meta.glob("../res/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const englishGt = getFileContent("english_gt.md") ?? "";

const copy = {
  fr: {
    title: "Comparatif des traductions IA",
    subtitle: "Vue simple pour comparer la qualité et la cohérence des traductions.",
    french: "Français",
    portuguese: "Portugais",
    score: "Score global",
    scoreHelpTitle: "Comment lire le score",
    scoreHelp:
      "Le score vérifie si la traduction garde la même structure que le texte de référence (titres, listes, liens, variables). Plus le score est haut, plus la structure est fiable.",
    input: "Prix entrée",
    output: "Prix sortie",
    perMillion: "/M",
    avgTime: "Temps moyen",
    estimatedPrice: "Prix estimé",
    priceHelpTitle: "Comment le prix est estimé",
    priceHelp:
      "On estime le nombre de tokens avec la règle simple 1 token ~= 4 caractères. Prix estimé = coût du texte anglais fourni au modèle + coût du texte traduit généré.",
    preview: "Aperçu",
    translation: "Traduction",
    gt: "Référence anglaise",
    sideBySide: "Côte à côte",
    details: "Détails",
    chars: "Caractères",
    lines: "Lignes",
    headings: "Titres",
    lists: "Listes",
    links: "Liens",
    placeholders: "Variables",
    docs: "Voir le modèle",
  },
  pt: {
    title: "Comparativo de traduções com IA",
    subtitle: "Visão simples para comparar qualidade e consistência das traduções.",
    french: "Francês",
    portuguese: "Português",
    score: "Pontuação geral",
    scoreHelpTitle: "Como interpretar a pontuação",
    scoreHelp:
      "A pontuação verifica se a tradução mantém a mesma estrutura do texto de referência (títulos, listas, links e variáveis). Quanto maior, mais confiável a estrutura.",
    input: "Preço entrada",
    output: "Preço saída",
    perMillion: "/M",
    avgTime: "Tempo médio",
    estimatedPrice: "Preço estimado",
    priceHelpTitle: "Como o preço é estimado",
    priceHelp:
      "Estimamos o número de tokens com a regra simples 1 token ~= 4 caracteres. Preço estimado = custo do texto em inglês enviado ao modelo + custo do texto traduzido gerado.",
    preview: "Visualização",
    translation: "Tradução",
    gt: "Referência em inglês",
    sideBySide: "Lado a lado",
    details: "Detalhes",
    chars: "Caracteres",
    lines: "Linhas",
    headings: "Títulos",
    lists: "Listas",
    links: "Links",
    placeholders: "Variáveis",
    docs: "Ver modelo",
  },
} as const;

function getFileContent(filename: string): string | null {
  const entry = Object.entries(markdownFiles).find(([path]) =>
    path.endsWith(`/${filename}`),
  );
  return entry?.[1] ?? null;
}

function ratio(a: number, b: number): number {
  if (a === 0 && b === 0) return 1;
  if (a === 0 || b === 0) return 0;
  const high = Math.max(a, b);
  const low = Math.min(a, b);
  return low / high;
}

function getMetrics(content: string): StructuralMetrics {
  return {
    charCount: content.length,
    lineCount: content.split("\n").length,
    headingCount: (content.match(/^#{1,6}\s+/gm) ?? []).length,
    listCount: (content.match(/^[-*]\s+/gm) ?? []).length,
    linkCount: (content.match(/\[[^\]]+\]\([^)]+\)/g) ?? []).length,
    placeholderCount: (content.match(/\{\{[^}]+\}\}/g) ?? []).length,
  };
}

function computeScore(translation: StructuralMetrics, gt: StructuralMetrics): number {
  const weighted =
    ratio(translation.charCount, gt.charCount) * 0.25 +
    ratio(translation.headingCount, gt.headingCount) * 0.2 +
    ratio(translation.listCount, gt.listCount) * 0.2 +
    ratio(translation.linkCount, gt.linkCount) * 0.2 +
    ratio(translation.placeholderCount, gt.placeholderCount) * 0.15;
  return Math.round(weighted * 100);
}

function estimatePrice(
  model: TranslationModel,
  sourceContent: string,
  translatedContent: string,
): number {
  const inputTokens = sourceContent.length / 4;
  const outputTokens = translatedContent.length / 4;
  const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
  return inputCost + outputCost;
}

function filenameForLanguage(model: TranslationModel, language: Language): string {
  return language === "fr" ? model.filenameFr : model.filenamePt;
}

function splitNumberedSections(content: string): SplitMarkdown {
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

export default function Home() {
  const [language, setLanguage] = useState<Language>("fr");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("split");
  const [selectedModelName, setSelectedModelName] = useState<string>(MODELS[0]?.name ?? "");
  const t = copy[language];
  const gtMetrics = useMemo(() => getMetrics(englishGt), []);

  const study = useMemo<ComparedMetrics[]>(() => {
    return MODELS.map((model) => {
      const translation = getFileContent(filenameForLanguage(model, language)) ?? "";
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
          <div className="inline-flex rounded-xl border border-slate-300 bg-white p-1">
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${language === "fr" ? "bg-slate-900 text-white" : "text-slate-700"}`}
            >
              🇫🇷 {t.french}
            </button>
            <button
              type="button"
              onClick={() => setLanguage("pt")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${language === "pt" ? "bg-slate-900 text-white" : "text-slate-700"}`}
            >
              🇵🇹 {t.portuguese}
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
            {study.map((row) => (
              <button
                key={row.model.name}
                type="button"
                onClick={() => setSelectedModelName(row.model.name)}
                className={`rounded-xl border p-4 text-left transition ${selected?.model.name === row.model.name ? "border-slate-900 bg-slate-100 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"}`}
              >
                <p className="text-base font-semibold">{row.model.name}</p>
                <p className="mt-2 text-xs text-slate-600">
                  {t.input} ${row.model.inputPrice}
                  {t.perMillion} • {t.output} ${row.model.outputPrice}
                  {t.perMillion}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {t.avgTime}: {formatTime(row.model.avgTimeInSeconds * 1_000)}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {t.estimatedPrice}: $
                  {estimatePrice(row.model, englishGt, row.translation).toFixed(4)}
                </p>
                <p className="mt-3 text-sm font-medium">
                  {t.score}: <span className="font-semibold">{row.score}/100</span>
                </p>
              </button>
            ))}
            </div>
          </div>

          {selected ? (
            <aside className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{t.details}</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700">
                <p>{t.chars}: {selected.metrics.charCount}</p>
                <p>{t.lines}: {selected.metrics.lineCount}</p>
                <p>{t.headings}: {selected.metrics.headingCount}</p>
                <p>{t.lists}: {selected.metrics.listCount}</p>
                <p>{t.links}: {selected.metrics.linkCount}</p>
                <p>{t.placeholders}: {selected.metrics.placeholderCount}</p>
              </div>
              <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{t.scoreHelpTitle}</p>
                <p className="mt-1">{t.scoreHelp}</p>
              </div>
              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{t.priceHelpTitle}</p>
                <p className="mt-1">{t.priceHelp}</p>
              </div>
              <a
                href={selected.model.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {t.docs}
              </a>
            </aside>
          ) : null}
        </div>

        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-xl border border-slate-300 bg-white p-1">
            <button
              type="button"
              onClick={() => setPreviewMode("translation")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${previewMode === "translation" ? "bg-slate-900 text-white" : "text-slate-700"}`}
            >
              {t.translation}
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("gt")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${previewMode === "gt" ? "bg-slate-900 text-white" : "text-slate-700"}`}
            >
              {t.gt}
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("split")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${previewMode === "split" ? "bg-slate-900 text-white" : "text-slate-700"}`}
            >
              {t.sideBySide}
            </button>
          </div>
        </div>

        {selected ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {previewMode === "translation" ? (
              <div className="mx-auto w-full max-w-[760px]">
                <MarkdownPanel title={`${t.preview} (${language.toUpperCase()}) • ${selected.model.name}`} content={selected.translation} />
              </div>
            ) : null}
            {previewMode === "gt" ? (
              <div className="mx-auto w-full max-w-[760px]">
                <MarkdownPanel title={t.gt} content={englishGt} />
              </div>
            ) : null}
            {previewMode === "split" ? (
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

function SplitMarkdownComparison({
  gtContent,
  gtTitle,
  translationContent,
  translationTitle,
}: {
  gtContent: string;
  gtTitle: string;
  translationContent: string;
  translationTitle: string;
}) {
  const translation = splitNumberedSections(translationContent);
  const gt = splitNumberedSections(gtContent);
  const sectionNumbers = [...new Set([...translation.sections.keys(), ...gt.sections.keys()])].sort(
    (a, b) => a - b,
  );
  const hasIntro = translation.intro.length > 0 || gt.intro.length > 0;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <p className="text-lg font-semibold">{translationTitle}</p>
        <p className="text-lg font-semibold">{gtTitle}</p>
      </div>

      {hasIntro ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <MarkdownBlock content={translation.intro} />
          <MarkdownBlock content={gt.intro} />
        </div>
      ) : null}

      {sectionNumbers.map((sectionNumber) => (
        <div key={sectionNumber} className="grid items-start gap-4 lg:grid-cols-2">
          <MarkdownBlock content={translation.sections.get(sectionNumber) ?? ""} />
          <MarkdownBlock content={gt.sections.get(sectionNumber) ?? ""} />
        </div>
      ))}
    </div>
  );
}

function MarkdownPanel({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <section className="w-full rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <article className="markdown-body mt-5 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </section>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <section className="w-full rounded-lg border border-slate-200 bg-white p-4">
      <article className="markdown-body max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </section>
  );
}
