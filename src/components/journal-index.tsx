'use client';

import Image from 'next/image';
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

function EditorialArtwork({ index }: { index: number }) {
  const { i18nText } = useSiteTranslation();
  return <span className="journal-editorial-art" aria-hidden="true">
    <span className="journal-editorial-art-index">{i18nText('PAUSA DO CAFÉ · CADERNO')} {String(index + 1).padStart(2, '0')}</span>
    <span className="journal-editorial-art-orbit" />
    <strong>{String(index + 1).padStart(2, '0')}</strong>
    <span className="journal-editorial-art-caption">DESIGN <i>×</i> {i18nText('PENSAMENTO')}</span>
  </span>;
}

function EditorialCard({ post, index, locale, featuredLabel, readLabel, variant }: {
  post: JournalPost;
  index: number;
  locale: 'pt' | 'en';
  featuredLabel: string;
  readLabel: string;
  variant: 'featured' | 'visual' | 'typographic';
}) {
  const { i18nText, i18nHref } = useSiteTranslation();
  const view = journalPostForLocale(post, locale);
  const date = (post.publishAt || post.date).slice(0, 10);
  const readTime = readingMinutes({ ...post, content: view.content });

  return <article className={`journal-editorial-card journal-editorial-card-${variant}`}>
    <a href={i18nHref(`/blog/${post.slug}`)} onClick={() => trackEvent('journal_article_open', { placement: 'index', slug: post.slug, category: post.category })}>
      <span className="journal-editorial-cover">
        {post.cover ? <Image src={post.cover.src} alt={view.coverAlt || post.cover.alt} width={post.cover.width} height={post.cover.height}
          sizes={variant === 'featured' ? '(max-width: 700px) calc(100vw - 2 * var(--gutter)), (max-width: 1100px) 52vw, 760px' : '(max-width: 700px) calc(100vw - 2 * var(--gutter)), (max-width: 1100px) 48vw, 620px'}
          style={{ objectPosition: post.cover.position || 'center' }} {...(variant === 'featured' ? { preload: true } : {})} /> : <EditorialArtwork index={index} />}
      </span>
      <span className="journal-editorial-copy">
        <span className="journal-editorial-meta">
          {variant === 'featured' && <span className="journal-editorial-featured-label">{i18nText(featuredLabel)}</span>}
          <span>{i18nText(journalCategoryLabels[locale][post.category])}</span>
          {post.demo && <span className="journal-demo-label">{i18nText(journalCopy[locale].preview)}</span>}
          <time dateTime={date}>{i18nText(formatJournalDateLocale(date, locale))}</time>
        </span>
        <strong className="journal-editorial-title" lang={view.translated ? undefined : 'pt-BR'}>{i18nText(view.title)}</strong>
        <span className="journal-editorial-summary" lang={view.translated ? undefined : 'pt-BR'}>{i18nText(view.summary)}</span>
        <span className="journal-editorial-footer">
          <span>{i18nText(journalCopy[locale].reading(readTime))}</span>
          <span className="journal-editorial-action">{i18nText(readLabel)} <span aria-hidden="true">↗</span></span>
        </span>
      </span>
    </a>
  </article>;
}

export function JournalIndex({ posts, activeCategory }: {
  posts: JournalPost[];
  activeCategory?: JournalCategory;
}) {
  const { i18nText, i18nHref } = useSiteTranslation();
  const { locale, query, setQuery } = useJournalPreferences();
  const copy = journalCopy[locale];
  const [page, setPage] = useState(1);
  const publishedPosts = posts.filter(post => post.status === 'published' && !post.demo);
  const listedPosts = posts.filter(post => post.status === 'published' || post.demo);

  useEffect(() => setPage(1), [query, activeCategory]);

  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const categoryPosts = activeCategory ? listedPosts.filter(post => post.category === activeCategory) : listedPosts;
  const filtered = terms.length ? categoryPosts.filter(post => terms.every(term => searchableText(post).includes(term))) : categoryPosts;
  const categories = [...new Set(listedPosts.map(post => post.category))];
  const demoCount = listedPosts.filter(post => post.demo).length;
  const pageSize = 6;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const featured = page === 1 ? pageItems[0] : undefined;
  const remaining = page === 1 ? pageItems.slice(1) : pageItems;

  function clearSearch() {
    setQuery('');
    window.history.replaceState(null, '', i18nHref('/blog'));
    document.getElementById('journal-search')?.focus();
  }

  return <main id="conteudo" className="journal-page">
    <header className="journal-masthead">
      <div className="journal-masthead-inner">
        <nav className="journal-masthead-nav" aria-label={i18nText(copy.categoryFilter)}>
          <a href="#journal-feature" aria-current={!activeCategory ? 'page' : undefined}>{i18nText(copy.index)}</a>
          {categories.map(category => <a key={category} href={i18nHref(`/blog/categoria/${category}`)} aria-current={activeCategory === category ? 'page' : undefined} onClick={() => trackEvent('journal_filter', { filter: 'category', category })}>{i18nText(journalCategoryLabels[locale][category])}</a>)}
          <a href={i18nHref('/feed.xml')}>RSS <span aria-hidden="true">↗</span></a>
        </nav>

        <div className="journal-masthead-title">
          <div>
            <span className="eyebrow">{i18nText(copy.eyebrow)} {i18nText(copy.location)}</span>
            <h1>{i18nText('Pausa do ')}{i18nText('café')}</h1>
          </div>
          <div className="journal-masthead-description">
            <p>{i18nText(copy.intro)}</p>
            <span>{i18nText(copy.publishedCount(publishedPosts.length, demoCount))}</span>
          </div>
        </div>

        <div className="journal-ticker">
          <span>{i18nText(copy.featured)}</span>
          <p>{categories.map((category, index) => <span key={category}>{index > 0 && <i aria-hidden="true">✳</i>}{i18nText(journalCategoryLabels[locale][category])}</span>)}</p>
          <a href="#journal-articles">{i18nText(copy.index)} <span aria-hidden="true">↘</span></a>
        </div>

        {featured && <section className="journal-feature" id="journal-feature" aria-label={i18nText(copy.featured)}>
          <EditorialCard post={featured} index={0} locale={locale} featuredLabel={copy.featured} readLabel={copy.readArticle} variant="featured" />
        </section>}
      </div>
    </header>

    {i18nText(filtered.length === 0 ? <section className="journal-empty section-wrap" id="journal-articles">
      <span aria-hidden="true">✳</span>
      {listedPosts.length === 0 ? <p>{i18nText(copy.empty)}</p> : <div><p role="status">{i18nText(copy.noResults)}</p><button type="button" onClick={clearSearch}>{i18nText(copy.clear)} ↗</button></div>}
    </section> : <>
      {i18nText(terms.length > 0 && <p className="journal-search-count section-wrap" role="status">{i18nText(copy.results(filtered.length))}</p>)}

    </>)}

    {filtered.length > 0 && <section className="journal-archive section-wrap" id="journal-articles" aria-labelledby="journal-archive-title">
      <div className="journal-archive-heading">
        <span className="eyebrow">{i18nText(copy.archiveKicker)}</span>
        <h2 id="journal-archive-title">{i18nText(copy.archiveTitle)}</h2>
      </div>
      <div className="journal-archive-layout">
        <div className="journal-archive-feed">
          {remaining.length > 0 ? <ol className="journal-editorial-list">
            {remaining.map((post, index) => <li key={post.slug}>
              <EditorialCard post={post} index={index + 1} locale={locale} featuredLabel={copy.featured} readLabel={copy.readArticle} variant={post.cover ? 'visual' : 'typographic'} />
            </li>)}
          </ol> : <p className="journal-archive-empty">{i18nText(copy.archiveEmpty)}</p>}
          {totalPages > 1 && <nav className="journal-pagination" aria-label={i18nText(locale === 'en' ? 'Pages' : 'Páginas')}>
            <button disabled={page === 1} onClick={() => setPage(value => value - 1)}>{i18nText(copy.previousPage)}</button>
            <span>{i18nText(copy.page(page, totalPages))}</span>
            <button disabled={page === totalPages} onClick={() => setPage(value => value + 1)}>{i18nText(copy.nextPage)}</button>
          </nav>}
        </div>
        <aside className="journal-print-edition" aria-label={i18nText(copy.archiveKicker)}>
          <span className="eyebrow">{i18nText(copy.archiveKicker)}</span>
          <strong className="journal-print-number">01 / 26</strong>
          <div className="journal-print-cover" aria-hidden="true">
            <span>{i18nText('Pausa do ')}<br />{i18nText('café')}</span>
            <strong>{i18nText(copy.archiveTitle)}</strong>
            <em>{i18nText(copy.location)}</em>
            <span className="journal-print-mark">01 / 26 <b>↗</b></span>
          </div>
        </aside>
      </div>
    </section>}
    <section className="journal-newsletter-wrap section-wrap" aria-label={i18nText(copy.newsletterEyebrow)}>
      <Newsletter variant="blog" />
    </section>
  </main>;
}
