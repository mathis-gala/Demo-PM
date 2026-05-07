export interface TranslationModel {
  name: string;
  inputPrice: number;
  outputPrice: number;
  filenameFr: string;
  filenamePt: string;
  avgTimeInSeconds: number;
  link: string;
}

export const GPT54Mini: TranslationModel = {
  name: "GPT-5.4 mini",
  inputPrice: 0.75,
  outputPrice: 4.5,
  filenameFr: "translation_fr_gpt-5.4-mini.md",
  filenamePt: "translation_pt_gpt-5.4-mini.md",
  avgTimeInSeconds: 45,
  link: "https://developers.openai.com/api/docs/models/gpt-5.4-mini",
};

export const GPT5mini: TranslationModel = {
  name: "GPT-5 mini",
  inputPrice: 0.25,
  outputPrice: 2,
  filenameFr: "translation_fr_gpt-5-mini.md",
  filenamePt: "translation_pt_gpt-5-mini.md",
  avgTimeInSeconds: 90,
  link: "https://developers.openai.com/api/docs/models/gpt-5-mini",
};

export const GPT54Nano: TranslationModel = {
  name: "GPT-5.4 nano",
  inputPrice: 0.2,
  outputPrice: 1.25,
  filenameFr: "translation_fr_gpt-5.4-nano.md",
  filenamePt: "translation_pt_gpt-5.4-nano.md",
  avgTimeInSeconds: 60,
  link: "https://developers.openai.com/api/docs/models/gpt-5.4-nano",
};
