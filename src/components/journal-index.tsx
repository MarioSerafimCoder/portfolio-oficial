'use client';

import Link from 'next/link';
import {useJournalPreferences} from './journal-preferences';
import {formatJournalDateLocale, journalCategoryLabels, journalCopy, journalPostForLocale} from '@/content/journal-i18n';
import {readingMinutes, type JournalPost} from '@/content/journal';

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

function searchableText(post: JournalPost) {
  const localized = journalPostForLocale(post, 'en');
  const blocks = [...post.content, ...(post.translations?.en?.content || [])].flatMap(block => {
    if (block.type === 'paragraph') return block.text || block.segments?.map(segment => segment.text).join('') || '';
    if (block.type === 'heading' || block.type === 'quote') return block.text;
    if (block.type === 'list') return block.items.join(' ');
    return block.caption || '';
  });
  return normalize([post.title, post.summary, localized.title, localized.summary, journalCategoryLabels.pt[post.category], journalCategoryLabels.en[post.category], ...blocks].join(' '));
}

export function JournalIndex({posts}: {posts: JournalPost[]}) {
  const {locale, query, setQuery} = useJournalPreferences();
  const copy = journalCopy[locale];
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const filtered = terms.length ? posts.filter(post => terms.every(term => searchableText(post).includes(term))) : posts;
  function clearSearch() {
    setQuery('');
    window.history.replaceState(null, '', '/blog');
    document.getElementById('journal-search')?.focus();
  }
  return <main id="conteudo" className="journal-page">
    <header className="journal-hero section-wrap"><span className="eyebrow">{copy.eyebrow}</span><div className="journal-hero-copy"><h1>{copy.title}</h1><p>{copy.intro}</p></div></header>
    <section className="journal-index section-wrap" aria-labelledby="journal-index-title"><h2 id="journal-index-title">{copy.index}</h2>
      {posts.length === 0 ? <div className="journal-empty"><span aria-hidden="true">✳</span><p>{copy.empty}</p></div> : filtered.length === 0 ? <div className="journal-empty journal-no-results"><span aria-hidden="true">✳</span><div><p role="status">{copy.noResults}</p><button type="button" onClick={clearSearch}>{copy.clear} ↗</button></div></div> : <>
        {terms.length > 0 && <p className="journal-search-count" role="status">{copy.results(filtered.length)}</p>}
        <ol className="journal-list">{filtered.map(post => {
          const view = journalPostForLocale(post, locale);
          return <li key={post.slug}><article><Link href={`/blog/${post.slug}`}>
            <span className="journal-list-meta"><time dateTime={post.date}>{formatJournalDateLocale(post.date, locale)}</time><span>{journalCategoryLabels[locale][post.category]}</span>{post.demo && <span className="journal-demo-label">{copy.preview}</span>}</span>
            <span className="journal-list-main"><strong lang={view.translated ? undefined : 'pt-BR'}>{view.title}</strong><span className="journal-list-excerpt" lang={view.translated ? undefined : 'pt-BR'}>{view.summary}</span>{locale === 'en' && !view.translated && <span className="journal-translation-note">{copy.unavailableShort}</span>}<span className="journal-reading-time">{copy.reading(readingMinutes(post))}</span></span>
            <span className="journal-list-arrow" aria-hidden="true">↗</span>
          </Link></article></li>;
        })}</ol>
      </>}
    </section>
  </main>;
}
