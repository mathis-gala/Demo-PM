import test from 'node:test';
import assert from 'node:assert/strict';
import { extractPalette } from './colors.ts';

test('image extraction prefers useful color over a white majority, ignores invisible pixels and stays neutral for gray photos', () => {
  const pixels = new Uint8ClampedArray([
    ...Array(80).fill([255, 255, 255, 255]).flat(),
    ...Array(20).fill([180, 35, 90, 255]).flat(),
    ...Array(200).fill([0, 255, 0, 0]).flat(),
  ]);
  const colors = extractPalette(pixels);
  assert.equal(colors[0], '#B4235A');
  assert.ok(!colors.includes('#00FF00'));
  assert.deepEqual(extractPalette(new Uint8ClampedArray([128, 128, 128, 255])), ['#808080']);
  assert.throws(() => extractPalette(new Uint8ClampedArray([1, 2, 3, 0])), /visible/);
});

test('theme variants keep the selected seed, preserve the reference and maintain readable text', async () => {
  const { createTheme, contrastRatio } = await import('./colors.ts');
  const original = createTheme('#122161', 0);
  assert.equal(original.primary, '#122161');
  assert.equal(original.background, '#F7F7F7');
  assert.equal(original.surface, '#FFFFFF');
  for (const seed of [
    '#FFFF00',
    '#FFFFFF',
    '#000000',
    '#00FF00',
    '#FF88CC',
    '#122161',
    '#777777',
  ]) {
    const backgrounds = new Set();
    for (let mode = 0; mode < 3; mode++) {
      const theme = createTheme(seed, mode);
      assert.equal(theme.seed, seed);
      backgrounds.add(theme.background);
      for (const background of [theme.primary, theme.primaryEnd]) {
        assert.ok(contrastRatio(theme.onPrimary, background) >= 4.5, `${seed}: button contrast`);
      }
      for (const background of [theme.background, theme.surface, theme.selection]) {
        assert.ok(contrastRatio(theme.text, background) >= 4.5, `${seed}: text contrast`);
        assert.ok(contrastRatio(theme.primary, background) >= 4.5, `${seed}: heading contrast`);
      }
    }
    assert.equal(backgrounds.size, 3);
  }
});
