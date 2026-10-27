'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useJournalPreferences } from './journal-preferences';
import { formatJournalDateLocale, journalCategoryLabels, journalCopy, journalPostForLocale } from '@/content/journal-i18n';
import { readingMinutes, type JournalCategory, type JournalPost } from '@/content/journal';
import { Newsletter } from './newsletter';
function normalize(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}
function searchableText(post: JournalPost) {
    const localized = journalPostForLocale(post, 'en');
    const blocks = [...post.content, ...(post.translations?.en?.content || [])].flatMap(block => {
        if (block.type === 'paragraph')
            return block.text || block.segments?.map(segment => segment.text).join('') || '';
        if (block.type === 'heading' || block.type === 'quote')
            return block.text;
        if (block.type === 'list')
            return block.items.join(' ');
        return block.caption || '';
    });
    return normalize([post.title, post.summary, localized.title, localized.summary, journalCategoryLabels.pt[post.category], journalCategoryLabels.en[post.category], ...blocks].join(' '));
}
export function JournalIndex({ posts, activeCategory }: {
    posts: JournalPost[];
    activeCategory?: JournalCategory;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const { locale, query, setQuery } = useJournalPreferences();
    const copy = journalCopy[locale];
    const [page, setPage] = useState(1);
    useEffect(() => setPage(1), [query, activeCategory]);
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const categoryPosts = activeCategory ? posts.filter(post => post.category === activeCategory) : posts;
    const filtered = terms.length ? categoryPosts.filter(post => terms.every(term => searchableText(post).includes(term))) : categoryPosts;
    const categories = [...new Set(posts.map(post => post.category))];
    const totalPages = Math.ceil(filtered.length / 6);
    const visible = filtered.slice((page - 1) * 6, page * 6);
    function clearSearch() {
        setQuery('');
        window.history.replaceState(null, '', i18nHref('/blog'));
        document.getElementById('journal-search')?.focus();
    }
    return <main id="conteudo" className="journal-page">
    <header className="journal-hero section-wrap"><span className="eyebrow">{i18nText(copy.eyebrow)}</span><div className="journal-hero-copy"><h1>{i18nText("Pausa do ")}<em>{i18nText("caf\u00E9")}</em></h1><p>{i18nText(copy.intro)}</p></div></header>
    <section className={`journal-index section-wrap${activeCategory ? '' : ' journal-index-plain'}`} aria-labelledby="journal-index-title"><h2 id="journal-index-title" className={activeCategory ? undefined : 'sr-only'}>{i18nText(activeCategory ? journalCategoryLabels[locale][activeCategory] : copy.index)}</h2>
      {i18nText(categories.length > 1 && <nav className="journal-categories" aria-label={i18nText(copy.categoryFilter)}><Link href={i18nHref("/blog")} aria-current={!activeCategory ? 'page' : undefined}>{i18nText(copy.allCategories)}</Link>{i18nText(categories.map(category => <Link key={category} href={i18nHref(`/blog/categoria/${category}`)} aria-current={activeCategory === category ? 'page' : undefined}>{i18nText(journalCategoryLabels[locale][category])}</Link>))}</nav>)}
      {i18nText(posts.length === 0 ? <div className="journal-empty"><span aria-hidden="true">{i18nText("\u2733")}</span><p>{i18nText(copy.empty)}</p></div> : filtered.length === 0 ? <div className="journal-empty journal-no-results"><span aria-hidden="true">{i18nText("\u2733")}</span><div><p role="status">{i18nText(copy.noResults)}</p><button type="button" onClick={clearSearch}>{i18nText(copy.clear)}{i18nText(" \u2197")}</button></div></div> : <>
        {i18nText(terms.length > 0 && <p className="journal-search-count" role="status">{i18nText(copy.results(filtered.length))}</p>)}
        <ol className="journal-list">{i18nText(visible.map(post => {
                const view = journalPostForLocale(post, locale);
                return <li key={post.slug}><article><Link href={i18nHref(`/blog/${post.slug}`)}>
            <span className="journal-list-meta"><time dateTime={post.date}>{i18nText(formatJournalDateLocale(post.date, locale))}</time><span>{i18nText(journalCategoryLabels[locale][post.category])}</span>{i18nText(post.demo && <span className="journal-demo-label">{i18nText(copy.preview)}</span>)}</span>
            <span className="journal-list-main"><strong lang={view.translated ? undefined : 'pt-BR'}>{i18nText(view.title)}</strong><span className="journal-list-excerpt" lang={view.translated ? undefined : 'pt-BR'}>{i18nText(view.summary)}</span>{i18nText(locale === 'en' && !view.translated && <span className="journal-translation-note">{i18nText(copy.unavailableShort)}</span>)}<span className="journal-reading-time">{i18nText(copy.reading(readingMinutes(post)))}</span></span>
            <span className="journal-list-arrow" aria-hidden="true">{i18nText("\u2197")}</span>
          </Link></article></li>;
            }))}</ol>
        {i18nText(totalPages > 1 && <nav className="journal-pagination" aria-label={i18nText(locale === 'en' ? 'Pages' : 'Páginas')}><button disabled={page === 1} onClick={() => setPage(value => value - 1)}>{i18nText(copy.previousPage)}</button><span>{i18nText(copy.page(page, totalPages))}</span><button disabled={page === totalPages} onClick={() => setPage(value => value + 1)}>{i18nText(copy.nextPage)}</button></nav>)}
      </>)}
    </section>
    <Newsletter />
  </main>;
}
