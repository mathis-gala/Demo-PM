import { GPT54Mini, GPT54Nano, GPT5mini } from '../res/model';
import type { TranslationModel } from '../res/model';
import type { Language } from '../types';

export const MODELS: TranslationModel[] = [GPT54Mini, GPT5mini, GPT54Nano];

export function filenameForLanguage(model: TranslationModel, language: Language): string {
  return language === 'fr' ? model.filenameFr : model.filenamePt;
}
