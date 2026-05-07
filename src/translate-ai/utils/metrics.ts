import type { StructuralMetrics } from '../types';

function ratio(a: number, b: number): number {
  if (a === 0 && b === 0) return 1;
  if (a === 0 || b === 0) return 0;
  const high = Math.max(a, b);
  const low = Math.min(a, b);
  return low / high;
}

export function getMetrics(content: string): StructuralMetrics {
  return {
    charCount: content.length,
    lineCount: content.split('\n').length,
    headingCount: (content.match(/^#{1,6}\s+/gm) ?? []).length,
    listCount: (content.match(/^[-*]\s+/gm) ?? []).length,
    linkCount: (content.match(/\[[^\]]+\]\([^)]+\)/g) ?? []).length,
    placeholderCount: (content.match(/\{\{[^}]+\}\}/g) ?? []).length,
  };
}

export function computeScore(translation: StructuralMetrics, gt: StructuralMetrics): number {
  const weighted =
    ratio(translation.charCount, gt.charCount) * 0.25 +
    ratio(translation.headingCount, gt.headingCount) * 0.2 +
    ratio(translation.listCount, gt.listCount) * 0.2 +
    ratio(translation.linkCount, gt.linkCount) * 0.2 +
    ratio(translation.placeholderCount, gt.placeholderCount) * 0.15;
  return Math.round(weighted * 100);
}
