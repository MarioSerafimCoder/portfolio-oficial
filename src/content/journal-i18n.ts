import {journalCategories, type JournalCategory, type JournalPost} from './journal';
import type {JournalLocale} from '@/components/journal-preferences';

export const journalCategoryLabels: Record<JournalLocale, Record<JournalCategory, string>> = {
  pt: journalCategories,
  en: {'direcao-de-arte': 'Art direction', branding: 'Branding', processo: 'Process', 'design-e-tecnologia': 'Design and technology', 'pesquisa-e-referencias': 'Research and references'},
};

export const journalCopy = {
  pt: {
    search: 'Pesquisar textos', searchButton: 'Pesquisar', language: 'Mudar o Diário para inglês', themeLight: 'Ativar tema claro', themeDark: 'Ativar tema escuro',
    eyebrow: 'DIÁRIO DE BORDO', title: 'Pausa do café', intro: 'Entre uma arte e outra, compartilho reflexões, descobertas e umas provocações sobre o mundo criativo. Traz teu café e vem descobrir alguma coisa interessante por aqui.',
    index: 'Textos e anotações', empty: 'Ainda não publiquei nada por aqui. Estou preparando os primeiros textos.', noResults: 'Nenhum texto encontrado para esta busca.', clear: 'Limpar busca', results: (n: number) => `${n} ${n === 1 ? 'texto encontrado' : 'textos encontrados'}`,
    preview: 'TESTE LOCAL', read: 'Ler', reading: (n: number) => `${n} min de leitura`, back: '← Voltar ao Diário', backFull: '← Voltar ao Diário de bordo', demo: 'PRÉVIA LOCAL · Texto demonstrativo, ainda não publicado.', demoAuthor: 'Exemplo de layout', unavailable: 'Este texto está disponível apenas em português.', unavailableShort: 'Somente em português',
    toc: 'Neste texto', tocLabel: 'Índice do artigo', references: 'Referências', source: 'Fonte', related: 'Continue lendo', relatedLabel: 'Continuar a leitura', readArticle: 'Ler artigo ↗', copy: 'Copiar link', copied: 'Link copiado.', copyError: 'Não foi possível copiar. Use o endereço do navegador.',
    footerArticleTitle: 'Quer conversar sobre alguma ideia?', footerArticleText: 'Se alguma coisa daqui fez sentido para você, ou se tem um projeto em mente, meu contato está logo ali.', footerIndexTitle: 'Quer conversar sobre algum projeto?', footerIndexText: 'Se o assunto for identidade visual, direção de arte ou um projeto que você está começando, meu contato está por aqui.', contact: 'Entrar em contato ↗',
  },
  en: {
    search: 'Search articles', searchButton: 'Search', language: 'Switch the journal to Portuguese', themeLight: 'Switch to light mode', themeDark: 'Switch to dark mode',
    eyebrow: 'JOURNAL', title: 'Coffee break', intro: 'Between one piece of work and the next, I share reflections, discoveries and a few provocations about the creative world. Bring your coffee and see what you find here.',
    index: 'Notes and articles', empty: 'I haven’t published anything here yet. The first articles are on their way.', noResults: 'No articles match this search.', clear: 'Clear search', results: (n: number) => `${n} ${n === 1 ? 'article found' : 'articles found'}`,
    preview: 'LOCAL PREVIEW', read: 'Read', reading: (n: number) => `${n} min read`, back: '← Back to the journal', backFull: '← Back to the journal', demo: 'LOCAL PREVIEW · Sample text, not yet published.', demoAuthor: 'Layout example', unavailable: 'This article is currently available in Portuguese only.', unavailableShort: 'Portuguese only',
    toc: 'In this article', tocLabel: 'Article contents', references: 'References', source: 'Source', related: 'Keep reading', relatedLabel: 'Keep reading', readArticle: 'Read article ↗', copy: 'Copy link', copied: 'Link copied.', copyError: 'Could not copy the link. Use the address in your browser.',
    footerArticleTitle: 'Want to talk about an idea?', footerArticleText: 'If something here resonated with you, or if you have a project in mind, you can get in touch.', footerIndexTitle: 'Want to talk about a project?', footerIndexText: 'If it involves visual identity, art direction or a project you’re starting, you can get in touch.', contact: 'Get in touch ↗',
  },
} as const;

export function journalPostForLocale(post: JournalPost, locale: JournalLocale) {
  const translation = locale === 'en' ? post.translations?.en : undefined;
  return {title: translation?.title || post.title, summary: translation?.summary || post.summary, content: translation?.content || post.content, translated: locale === 'pt' || Boolean(translation)};
}

export function formatJournalDateLocale(date: string, locale: JournalLocale, compact = false) {
  const value = new Date(`${date}T12:00:00Z`);
  const formatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'pt-BR', {day: 'numeric', month: compact ? 'short' : 'long', year: 'numeric', timeZone: 'UTC'});
  if (locale === 'en' || !compact) return formatter.format(value);
  const parts = formatter.formatToParts(value);
  return ['day', 'month', 'year'].map(type => parts.find(part => part.type === type)?.value).join(' ');
}
