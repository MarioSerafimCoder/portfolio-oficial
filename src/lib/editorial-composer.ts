import {toMarkdown} from 'mdast-util-to-markdown';

export type EditorialKind = 'quote' | 'impact' | 'author';
export type EditorialDraft = {kind: EditorialKind; text: string; author: string; source: string; url: string};
type Text = {type: 'text'; value: string};
type Link = {type: 'link'; url: string; children: Text[]};
type Paragraph = {type: 'paragraph'; children: (Text | Link)[]};
const textNode = (value: string): Text => ({type: 'text', value});
const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim();

/** Plain form values become Markdown nodes, so punctuation never becomes user-authored code. */
export function editorialMarkdown(draft: EditorialDraft): {markdown: string; error?: string; errorField?: 'text' | 'url'} {
  const paragraphs = draft.text.replace(/\r\n?/g, '\n').split(/\n[\t ]*\n/).map(p => p.trim()).filter(Boolean);
  if (!paragraphs.length) return {markdown: ''};
  let url = draft.url.trim();
  if (url) {
    try {
      const parsed = new URL(url);
      if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error();
      url = parsed.href;
    } catch {
      return {markdown: '', error: 'Use um endereço completo, começando com https:// ou http://.', errorField: 'url'};
    }
  }
  const author = draft.kind === 'quote' ? oneLine(draft.author) : '';
  const source = oneLine(draft.source) || (url ? 'Fonte' : '');
  const hasCredit = draft.kind === 'quote' && Boolean(author || source);
  if (draft.kind === 'quote' && !hasCredit && paragraphs.length > 1 && paragraphs.at(-1)!.startsWith('— ')) {
    return {markdown: '', error: 'Preencha a autoria no campo próprio ou retire o travessão do último parágrafo.', errorField: 'text'};
  }
  const body: Paragraph[] = paragraphs.map(value => ({type: 'paragraph', children: [textNode(value)]}));
  const reference: Text | Link = url ? {type: 'link', url, children: [textNode(source)]} : textNode(source);
  if (hasCredit) {
    body.push({type: 'paragraph', children: [textNode('— ' + author + (author && source ? ', ' : '')), ...(source ? [reference] : [])]});
  } else if (source) {
    body.push({type: 'paragraph', children: [reference]});
  }
  const content = toMarkdown({type: 'root', children: body}).trimEnd();
  return {markdown: `> [!${draft.kind.toUpperCase()}]\n>\n${content.split('\n').map(line => line ? `> ${line}` : '>').join('\n')}\n`};
}
