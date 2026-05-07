import type { TranslationModel } from './res/model';

export type Language = 'fr' | 'pt';
export type PreviewMode = 'translation' | 'gt' | 'split';

export interface StructuralMetrics {
  charCount: number;
  lineCount: number;
  headingCount: number;
  listCount: number;
  linkCount: number;
  placeholderCount: number;
}

export interface ComparedMetrics {
  model: TranslationModel;
  translation: string;
  metrics: StructuralMetrics;
  score: number;
}

export interface SplitMarkdown {
  intro: string;
  sections: Map<number, string>;
}

export interface TranslationCopy {
  title: string;
  subtitle: string;
  french: string;
  portuguese: string;
  score: string;
  scoreHelpTitle: string;
  scoreHelp: string;
  input: string;
  output: string;
  perMillion: string;
  avgTime: string;
  estimatedPrice: string;
  priceHelpTitle: string;
  priceHelp: string;
  preview: string;
  translation: string;
  gt: string;
  sideBySide: string;
  details: string;
  chars: string;
  lines: string;
  headings: string;
  lists: string;
  links: string;
  placeholders: string;
  docs: string;
}
