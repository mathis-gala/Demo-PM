export function probabilities(counts: number[], alpha: number): number[] {
  const weights = counts.map((n) => (n > 0 ? n ** alpha : 0));
  const total = weights.reduce((sum, n) => sum + n, 0);
  return weights.map((n) => (total > 0 ? n / total : 0));
}

// Only shop exposure is aggregated; the uniform product draw does not change these shares.
export function simulate(
  counts: number[],
  alpha: number,
  draws: number,
  random = Math.random
): number[] {
  const shares = probabilities(counts, alpha);
  const hits = counts.map(() => 0);
  if (!shares.some((p) => p > 0)) return hits;
  let sum = 0;
  const cumulative = shares.map((p) => (sum += p));
  for (let draw = 0; draw < draws; draw++) {
    const value = random();
    let index = cumulative.findIndex((p) => value < p);
    if (index < 0) index = counts.length - 1;
    while (shares[index] === 0) index--;
    hits[index]++;
  }
  return hits;
}
