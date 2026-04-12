export function formatTime(ms: number): string {
  const abs = Math.abs(ms);

  if (abs < 1_000) {
    return `${ms}ms`;
  }

  if (abs < 60_000) {
    const s = ms / 1_000;
    return `${Number.isInteger(s) ? s.toFixed(0) : s.toFixed(2)}s`;
  }

  if (abs < 3_600_000) {
    const m = Math.floor(abs / 60_000);
    const s = Math.round((abs % 60_000) / 1_000);
    return s > 0 ? `${m}min ${s}s` : `${m}min`;
  }

  const h = Math.floor(abs / 3_600_000);
  const m = Math.round((abs % 3_600_000) / 60_000);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
