import { extractPalette } from './colors';

export interface ImportedImage {
  url: string;
  name: string;
  colors: string[];
}
export const imageAccept = 'image/png,image/jpeg,image/webp';
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export async function readThemeImage(file: File): Promise<ImportedImage> {
  if (!imageAccept.split(',').includes(file.type))
    throw new Error('Choisissez une image JPG, PNG ou WebP.');
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error('Cette image dépasse 15 Mo. Choisissez une version plus légère.');
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('Impossible de lire cette image. Essayez un autre fichier JPG, PNG ou WebP.');
  }
  try {
    if (bitmap.width * bitmap.height > 40_000_000)
      throw new Error(
        'Cette image dépasse 40 mégapixels. Réduisez ses dimensions avant de l’importer.'
      );
    const scale = Math.min(1, 128 / Math.max(bitmap.width, bitmap.height));
    const sample = document.createElement('canvas');
    sample.width = Math.max(1, Math.round(bitmap.width * scale));
    sample.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = sample.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Votre navigateur ne permet pas l’analyse des images.');
    context.drawImage(bitmap, 0, 0, sample.width, sample.height);
    const colors = extractPalette(context.getImageData(0, 0, sample.width, sample.height).data);
    const previewScale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    sample.width = Math.max(1, Math.round(bitmap.width * previewScale));
    sample.height = Math.max(1, Math.round(bitmap.height * previewScale));
    context.drawImage(bitmap, 0, 0, sample.width, sample.height);
    return { url: sample.toDataURL('image/webp', 0.92), name: file.name, colors };
  } finally {
    bitmap.close();
  }
}
