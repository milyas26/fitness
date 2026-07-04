import { useMemo } from 'react';

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-secondary text-xs font-mono">$1</code>');

  const lines = html.split('\n');
  let inList = false;

  const processed = lines.map((line) => {
    if (/^#{1,3}\s/.test(line)) {
      const match = line.match(/^(#{1,3})/);
      const level = (match?.[1] ?? '#').length;
      const content = line.replace(/^#{1,3}\s+/, '');
      const sizes = ['text-base', 'text-sm', 'text-xs'];
      return `<h${level} class="${sizes[level - 1]} font-bold mt-3 mb-1 text-foreground">${content}</h${level}>`;
    }

    if (/^[-*]\s/.test(line.trim())) {
      const content = line.trim().replace(/^[-*]\s+/, '');
      const prefix = inList ? '' : '<ul class="list-disc pl-4 space-y-0.5 mt-1 mb-1">';
      inList = true;
      return `${prefix}<li class="text-xs text-muted-foreground">${content}</li>`;
    }

    if (inList) {
      inList = false;
      return `</ul>${line ? `<p class="text-xs text-muted-foreground mt-1">${line}</p>` : ''}`;
    }

    if (!line.trim()) return inList ? '' : '<br />';

    return `<p class="text-xs text-muted-foreground mt-1">${line}</p>`;
  });

  if (inList) processed.push('</ul>');

  return processed.join('\n');
}

export function Markdown({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
