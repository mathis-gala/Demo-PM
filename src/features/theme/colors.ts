import {
  argbFromHex,
  argbFromRgb,
  hexFromArgb,
  Hct,
  QuantizerCelebi,
  Score,
  TonalPalette,
  Contrast,
} from '@material/material-color-utilities';

export function extractPalette(data: Uint8ClampedArray): string[] {
  const pixels: number[] = [];
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 128) continue;
    pixels.push(argbFromRgb(data[index], data[index + 1], data[index + 2]));
  }
  if (!pixels.length)
    throw new Error('Cette image ne contient aucun pixel visible. Choisissez une autre image.');
  const clusters = QuantizerCelebi.quantize(pixels, 48);
  const byPopulation = [...clusters].sort((a, b) => b[1] - a[1]).map(([color]) => color);
  const ranked = Score.score(clusters, { desired: 6, fallbackColorARGB: byPopulation[0] });
  return [...new Set(ranked)].map((color) => hexFromArgb(color).toUpperCase());
}

export interface ImageTheme {
  seed: string;
  primary: string;
  primaryEnd: string;
  onPrimary: string;
  surface: string;
  background: string;
  selection: string;
  text: string;
  muted: string;
  border: string;
  scale: string[];
}
export const arrangements = ['Essentiel', 'Enveloppant', 'Contrasté'];

export function contrastRatio(first: string, second: string): number {
  return Contrast.ratioOfTones(
    Hct.fromInt(argbFromHex(first)).tone,
    Hct.fromInt(argbFromHex(second)).tone
  );
}

export function createTheme(seed: string, arrangement: number): ImageTheme {
  if (!/^#[0-9a-f]{6}$/i.test(seed)) throw new Error('Une couleur au format #RRGGBB est attendue.');
  const source = Hct.fromInt(argbFromHex(seed));
  const palette = TonalPalette.fromInt(argbFromHex(seed));
  const neutral = TonalPalette.fromHueAndChroma(source.hue, Math.min(source.chroma, 10));
  const tone = (value: number) => hexFromArgb(palette.tone(value)).toUpperCase();
  const neutralTone = (value: number) => hexFromArgb(neutral.tone(value)).toUpperCase();
  let background = '#F7F7F7';
  let selection = '#FFFFFF';
  if (arrangement === 1) {
    background = tone(92);
    selection = tone(88);
  }
  if (arrangement === 2) {
    background = neutralTone(98);
    selection = tone(96);
  }
  const surface = '#FFFFFF';
  let primary = seed.toUpperCase();
  let primaryTone = source.tone;
  if (arrangement === 2) {
    primaryTone = Math.min(primaryTone, 25);
    primary = tone(primaryTone);
  }
  const backgrounds = [background, surface, selection];
  while (primaryTone > 0 && backgrounds.some((color) => contrastRatio(primary, color) < 4.5)) {
    primaryTone = Math.max(0, primaryTone - 1);
    primary = tone(primaryTone);
  }
  let primaryEnd = primary;
  if (arrangement === 1) primaryEnd = tone(Math.max(0, primaryTone - 12));
  return {
    seed: seed.toUpperCase(),
    primary,
    primaryEnd,
    onPrimary: '#FFFFFF',
    surface,
    background,
    selection,
    text: neutralTone(16),
    muted: neutralTone(38),
    border: tone(55),
    scale: [seed.toUpperCase(), tone(95), tone(85), tone(65), primary, tone(15)],
  };
}
