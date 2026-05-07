import type { TranslationModel } from '../res/model';

export function estimatePrice(
  model: TranslationModel,
  sourceContent: string,
  translatedContent: string
): number {
  const inputTokens = sourceContent.length / 4;
  const outputTokens = translatedContent.length / 4;
  const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
  return inputCost + outputCost;
}
