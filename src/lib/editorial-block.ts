import type {MarkdownNode} from '@/content/journal';
const plain = (node: MarkdownNode): string => node.value || node.children?.map(plain).join('') || '';
/** Recognize only a complete marker paragraph; unknown or incomplete blocks stay intact. */
export function editorialBlock(node: MarkdownNode) {
  if (node.type !== 'blockquote') return null;
  const first = node.children?.[0];
  if (first?.type !== 'paragraph') return null;
  const marker = plain(first).trim().toUpperCase();
  const kind = marker === '[!QUOTE]' ? 'quote' : marker === '[!IMPACT]' ? 'impact' : marker === '[!AUTHOR]' ? 'author' : null;
  if (!kind || !node.children || node.children.length < 2) return null;
  const body = node.children.slice(1);
  const last = body[body.length - 1];
  // A final paragraph prefixed with an em dash is an optional quote credit.
  const attribution = kind === 'quote' && body.length > 1 && last.type === 'paragraph' && plain(last).startsWith('— ') ? body.pop() : undefined;
  return {kind, body, attribution};
}
