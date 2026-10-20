import type {JournalBlock} from '@/content/journal';

export function journalHeadings(content: JournalBlock[]) {
  const occurrences = new Map<string, number>();
  return content.flatMap((block, index) => {
    if (block.type !== 'heading') return [];
    const base = block.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'secao';
    const count = (occurrences.get(base) || 0) + 1;
    occurrences.set(base, count);
    return [{index, id: count === 1 ? base : `${base}-${count}`, level: block.level, text: block.text}];
  });
}
