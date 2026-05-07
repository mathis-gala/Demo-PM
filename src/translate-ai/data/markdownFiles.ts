const markdownFiles = import.meta.glob('../res/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function getFileContent(filename: string): string | null {
  const entry = Object.entries(markdownFiles).find(([path]) => path.endsWith(`/${filename}`));
  return entry?.[1] ?? null;
}

export const englishGt = getFileContent('english_gt.md') ?? '';
