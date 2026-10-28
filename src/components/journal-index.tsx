'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSiteTranslation } from '@/i18n/use-translation';
import { formatJournalDateLocale, journalCategoryLabels, journalCopy, journalPostForLocale } from '@/content/journal-i18n';
import { readingMinutes, type JournalCategory, type JournalPost } from '@/content/journal';
import { trackEvent } from '@/lib/analytics';
import { useJournalPreferences } from './journal-preferences';
import { Newsletter } from './newsletter';

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

function EditorialCard({ post, index, locale, featuredLabel, readLabel }: {
  post: JournalPost;
  index: number;
  locale: 'pt' | 'en';
  featuredLabel: string;
  readLabel: string;
}) {
  const { i18nText, i18nHref } = useSiteTranslation();
  const view = journalPostForLocale(post, locale);
  const presentation = index === 0 ? 'featured' : post.cover ? 'visual' : 'typographic';
  const date = (post.publishAt || post.date).slice(0, 10);
  const readTime = readingMinutes({ ...post, content: view.content });

  return <li className={`journal-editorial-card journal-editorial-card-${presentation}`}>
    <Link href={i18nHref(`/blog/${post.slug}`)} onClick={() => trackEvent('journal_article_open', {placement: 'index', slug: post.slug, category: post.category})}>
      {i18nText(post.cover ? <span className="journal-editorial-cover">
        <Image src={post.cover.src} alt={view.coverAlt || post.cover.alt} width={post.cover.width} height={post.cover.height}
          sizes={presentation === 'featured' ? '(max-width: 700px) calc(100vw - 2 * var(--gutter)), (max-width: 1100px) 52vw, 760px' : '(max-width: 700px) calc(100vw - 2 * var(--gutter)), (max-width: 1100px) 48vw, 620px'}
          style={{objectPosition: post.cover.position || 'center'}} {...(presentation === 'featured' ? {preload: true} : {})}/>
      </span> : <span className="journal-editorial-type-art" aria-hidden="true">
        <span>PAUSA DO CAFÉ</span><span className="journal-editorial-type-index">{String(index + 1).padStart(2, '0')}</span>
      </span>)}
      <span className="journal-editorial-copy">
        <span className="journal-editorial-meta">
          {i18nText(presentation === 'featured' && <span className="journal-editorial-featured-label">{i18nText(featuredLabel)}</span>)}
          <span>{i18nText(journalCategoryLabels[locale][post.category])}</span>
          <time dateTime={date}>{i18nText(formatJournalDateLocale(date, locale))}</time>
        </span>
        <strong className="journal-editorial-title" lang={view.translated ? undefined : 'pt-BR'}>{i18nText(view.title)}</strong>
        <span className="journal-editorial-summary" lang={view.translated ? undefined : 'pt-BR'}>{i18nText(view.summary)}</span>
        <span className="journal-editorial-footer">
          <span>{i18nText(journalCopy[locale].reading(readTime))}</span>
          <span className="journal-editorial-action">{i18nText(readLabel)} <span aria-hidden="true">↗</span></span>
        </span>
      </span>
    </Link>
  </li>;
}

export function JournalIndex({ posts, activeCategory }: {
  posts: JournalPost[];
  activeCategory?: JournalCategory;
}) {
  const { i18nText, i18nHref } = useSiteTranslation();
  const { locale, query, setQuery } = useJournalPreferences();
  const copy = journalCopy[locale];
  const [page, setPage] = useState(1);
  const publicPosts = posts.filter(post => post.status === 'published' && !post.demo);

  useEffect(() => setPage(1), [query, activeCategory]);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const categoryPosts = activeCategory ? publicPosts.filter(post => post.category === activeCategory) : publicPosts;
  const filtered = terms.length ? categoryPosts.filter(post => terms.every(term => searchableText(post).includes(term))) : categoryPosts;
  const categories = [...new Set(publicPosts.map(post => post.category))];
  const pageSize = 6;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function clearSearch() {
    setQuery('');
    window.history.replaceState(null, '', i18nHref('/blog'));
    document.getElementById('journal-search')?.focus();
  }

  return <main id="conteudo" className="journal-page">
    <header className="journal-hero section-wrap">
      <span className="eyebrow">{i18nText(copy.eyebrow)}</span>
      <div className="journal-hero-copy">
        <h1>{i18nText('Pausa do ')}<em>{i18nText('café')}</em></h1>
        <div className="journal-hero-description">
          <p>{i18nText(copy.intro)}</p>
          <span>{i18nText(copy.publishedCount(publicPosts.length))}</span>
        </div>
      </div>
    </header>

    <section className={`journal-index section-wrap${activeCategory ? '' : ' journal-index-plain'}`} aria-labelledby="journal-index-title">
      <div className="journal-index-heading">
        <h2 id="journal-index-title">{i18nText(activeCategory ? journalCategoryLabels[locale][activeCategory] : copy.index)}</h2>
      </div>
      {i18nText(categories.length > 1 && <nav className="journal-categories" aria-label={i18nText(copy.categoryFilter)}>
        <Link href={i18nHref('/blog')} aria-current={!activeCategory ? 'page' : undefined} onClick={() => trackEvent('journal_filter', {filter: 'category', category: 'all'})}>{i18nText(copy.allCategories)}</Link>
        {categories.map(category => <Link key={category} href={i18nHref(`/blog/categoria/${category}`)} aria-current={activeCategory === category ? 'page' : undefined}
          onClick={() => trackEvent('journal_filter', {filter: 'category', category})}>{i18nText(journalCategoryLabels[locale][category])}</Link>)}
      </nav>)}

      {i18nText(publicPosts.length === 0 ? <div className="journal-empty"><span aria-hidden="true">✳</span><p>{i18nText(copy.empty)}</p></div> : filtered.length === 0 ? <div className="journal-empty journal-no-results">
        <span aria-hidden="true">✳</span><div><p role="status">{i18nText(copy.noResults)}</p><button type="button" onClick={clearSearch}>{i18nText(copy.clear)}{i18nText(' ↗')}</button></div>
      </div> : <>
        {i18nText(terms.length > 0 && <p className="journal-search-count" role="status">{i18nText(copy.results(filtered.length))}</p>)}
        <ol className="journal-editorial-list">
          {visible.map((post, index) => <EditorialCard key={post.slug} post={post} index={(page - 1) * pageSize + index} locale={locale} featuredLabel={copy.featured} readLabel={copy.readArticle}/>) }
        </ol>
        {i18nText(totalPages > 1 && <nav className="journal-pagination" aria-label={i18nText(locale === 'en' ? 'Pages' : 'Páginas')}>
          <button disabled={page === 1} onClick={() => setPage(value => value - 1)}>{i18nText(copy.previousPage)}</button>
          <span>{i18nText(copy.page(page, totalPages))}</span>
          <button disabled={page === totalPages} onClick={() => setPage(value => value + 1)}>{i18nText(copy.nextPage)}</button>
        </nav>)}
      </>)}
    </section>
    <Newsletter variant="home"/>
  </main>;
}
