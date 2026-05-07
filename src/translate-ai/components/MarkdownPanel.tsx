import 'github-markdown-css/github-markdown-light.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPanelProps {
  content: string;
  title: string;
}

export function MarkdownPanel({ content, title }: MarkdownPanelProps) {
  return (
    <section className="w-full rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <MarkdownArticle content={content} className="mt-5" />
    </section>
  );
}

function MarkdownArticle({ content, className = '' }: { content: string; className?: string }) {
  const classNames = ['markdown-body max-w-none', className].filter(Boolean).join(' ');

  return (
    <article className={classNames}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}

export function MarkdownBlock({ content }: { content: string }) {
  return (
    <section className="h-full min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <MarkdownArticle content={content} />
    </section>
  );
}
