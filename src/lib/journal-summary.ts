import type {JournalBlock} from '@/content/journal';

/** Extractive summary: select representative sentences without inventing claims. */
export function journalSummary(content: JournalBlock[], fallback = '', maxLength = 320) {
  const paragraphs = content.flatMap(block => block.type === 'paragraph'
    ? [block.text ?? block.segments.map(segment => segment.text).join('')]
    : []);
  const sentences = paragraphs.flatMap(text => text.replace(/\s+/g, ' ').trim().match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) || [])
    .map(text => text.trim()).filter(text => text.split(/\s+/).length >= 7)
    // Avoid fragments that depend on a previous sentence, an image or demo notes.
    .filter(text => !/^(ela|ele|elas|eles|isso|isto|esse|essa|este|esta|aqui|it|they|this|that|these|those)\b/i.test(text))
    .filter(text => !/\b(imagem acima|image above|texto demonstrativo|uma demonstração|nesse percurso)\b/i.test(text));
  const words = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z]{5,}/g) || [];
  const topic = new Set(words(fallback));
  const frequency = new Map<string, number>();
  for (const sentence of sentences) for (const word of new Set(words(sentence))) frequency.set(word, (frequency.get(word) || 0) + 1);
  const ranked = sentences.map((text, index) => ({text, index,
    score: words(text).reduce((sum, word) => sum + (frequency.get(word) || 0) + (topic.has(word) ? 3 : 0), 0) / Math.sqrt(Math.max(1, words(text).length)),
  })).sort((a, b) => b.score - a.score || a.index - b.index);
  const selected: typeof ranked = [];
  for (const candidate of ranked) {
    if (selected.some(item => item.text === candidate.text)) continue;
    if (!selected.length || selected.reduce((sum, item) => sum + item.text.length + 1, 0) + candidate.text.length <= maxLength) selected.push(candidate);
    if (selected.length === 2) break;
  }
  const result = selected.sort((a, b) => a.index - b.index).map(item => item.text).join(' ') || fallback.trim();
  if (result.length <= maxLength) return result;
  const clipped = result.slice(0, maxLength - 1).replace(/\s+\S*$/, '').trimEnd();
  return `${clipped}…`;
}
