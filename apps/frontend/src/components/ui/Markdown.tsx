import { useMemo } from 'react';

function parseTable(lines: string[], startIdx: number): { html: string; endIdx: number } | null {
  const headerLine = lines[startIdx];
  if (!headerLine || !/^\|.+\|$/.test(headerLine)) return null;

  if (startIdx + 1 >= lines.length) return null;
  const sepLine = lines[startIdx + 1] ?? '';
  if (!/^\|[-:\s|]+\|$/.test(sepLine)) return null;

  const headers = headerLine.split('|').filter(c => c.trim() !== '').map(c => c.trim());

  const aligns = sepLine
    .split('|')
    .filter(c => c.trim() !== '')
    .map(c => {
      if (c.startsWith(':') && c.endsWith(':')) return 'center';
      if (c.endsWith(':')) return 'right';
      return 'left';
    });

  const alignClasses: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };

  const rows: string[] = [];
  let idx = startIdx + 2;
  while (idx < lines.length) {
    const rowLine = lines[idx] ?? '';
    if (!/^\|.+\|$/.test(rowLine)) break;
    const cells = rowLine
      .split('|')
      .filter(c => c.trim() !== '')
      .map(c => c.trim());
    rows.push(
      `<tr class="border-b border-border/50 last:border-b-0 hover:bg-secondary/20 transition-colors">${cells
        .slice(0, headers.length)
        .map((cell, ci) => {
          const alignCls = alignClasses[aligns[ci] ?? 'left'];
          return `<td class="px-3 py-1.5 text-xs text-muted-foreground ${alignCls}">${cell}</td>`;
        })
        .join('')}</tr>`,
    );
    idx++;
  }

  const thead = `<thead><tr class="border-b-2 border-border">${headers
    .map((h, i) => {
      const alignCls = alignClasses[aligns[i] ?? 'left'];
      return `<th class="px-3 py-1.5 text-xs font-semibold text-foreground ${alignCls}">${h}</th>`;
    })
    .join('')}</tr></thead>`;

  const tbody = `<tbody>${rows.join('')}</tbody>`;

  return {
    html: `<div class="overflow-x-auto my-2"><table class="w-full border border-border rounded-lg overflow-hidden">${thead}${tbody}</table></div>`,
    endIdx: idx,
  };
}

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-secondary text-xs font-mono">$1</code>');

  const lines = html.split('\n');
  const processed: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';

    const table = parseTable(lines, i);
    if (table) {
      if (inList) {
        processed.push('</ul>');
        inList = false;
      }
      processed.push(table.html);
      i = table.endIdx - 1;
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      if (inList) {
        processed.push('</ul>');
        inList = false;
      }
      const match = line.match(/^(#{1,3})/);
      const level = (match?.[1] ?? '#').length;
      const content = line.replace(/^#{1,3}\s+/, '');
      const sizes = ['text-base', 'text-sm', 'text-xs'];
      processed.push(`<h${level} class="${sizes[level - 1]} font-bold mt-3 mb-1 text-foreground">${content}</h${level}>`);
      continue;
    }

    if (/^[-*]\s/.test(line.trim())) {
      const content = line.trim().replace(/^[-*]\s+/, '');
      const prefix = inList ? '' : '<ul class="list-disc pl-4 space-y-0.5 mt-1 mb-1">';
      inList = true;
      processed.push(`${prefix}<li class="text-xs text-muted-foreground">${content}</li>`);
      continue;
    }

    if (inList) {
      inList = false;
      processed.push(`</ul>${line ? `<p class="text-xs text-muted-foreground mt-1">${line}</p>` : ''}`);
      continue;
    }

    if (!line.trim()) {
      processed.push(inList ? '' : '<br />');
      continue;
    }

    processed.push(`<p class="text-xs text-muted-foreground mt-1">${line}</p>`);
  }

  if (inList) processed.push('</ul>');

  return processed.join('\n');
}

export function Markdown({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
