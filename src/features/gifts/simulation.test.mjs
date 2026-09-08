import test from 'node:test';
import assert from 'node:assert/strict';
import { probabilities } from './simulation.ts';

test('zero-match shops are excluded even at alpha zero; endpoints preserve both reference methods', () => {
  assert.deepEqual(probabilities([0, 10, 100], 0), [0, 0.5, 0.5]);
  assert.deepEqual(probabilities([0, 10, 100], 1), [0, 10 / 110, 100 / 110]);
  assert.deepEqual(probabilities([0, 0], 0), [0, 0]);
  const p = probabilities([10, 1000], 0.5);
  assert.ok(Math.abs(p[1] / p[0] - 10) < 1e-10);
});

test('simulation conserves draws, never picks excluded shops, and approximates expected shares', async () => {
  const { simulate } = await import('./simulation.ts');
  let seed = 42;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const result = simulate([0, 10, 1000], 0.5, 50000, random);
  assert.equal(
    result.reduce((a, b) => a + b, 0),
    50000
  );
  assert.equal(result[0], 0);
  assert.ok(Math.abs(result[1] / 50000 - 1 / 11) < 0.01);
  assert.deepEqual(simulate([0, 0], 0, 100, random), [0, 0]);
});
