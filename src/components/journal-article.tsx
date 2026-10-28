'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Image from 'next/image';
import { journalHeadings } from '@/lib/journal-headings';
import { readingMinutes, type JournalBlock, type JournalPost } from '@/content/journal';
import { journalCategoryLabels, journalCopy, journalPostForLocale } from '@/content/journal-i18n';
import { useJournalPreferences } from './journal-preferences';
import { JournalShare } from './journal-share';
import {MarkdownContent} from './markdown-content';
import { JournalAuthorSignature } from './journal-author-signature';
import { Newsletter } from './newsletter';
import { ReadingProgress } from './reading-progress';
import { trackEvent } from '@/lib/analytics';
function ArticleBlock({ block, id, sourceLabel }: {
    block: JournalBlock;
    id?: string;
    sourceLabel: string;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    if (block.type === 'paragraph')
        return <p>{i18nText(block.segments ? block.segments.map((segment, index) => segment.href
                ? <a key={index} href={i18nHref(segment.href)} {...(/^https?:\/\//.test(segment.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{i18nText(segment.text)}</a>
                : <span key={index}>{i18nText(segment.text)}</span>) : block.text)}</p>;
    if (block.type === 'heading')
        return block.level === 2 ? <h2 id={id}>{i18nText(block.text)}</h2> : <h3 id={id}>{i18nText(block.text)}</h3>;
    if (block.type === 'list')
        return <ul>{i18nText(block.items.map(item => <li key={item}>{i18nText(item)}</li>))}</ul>;
    if (block.type === 'quote')
        return <blockquote><p>{i18nText(block.text)}</p>{i18nText(block.attribution && <cite>{i18nText(block.attribution)}</cite>)}</blockquote>;
    return <figure className={block.layout === 'wide' ? 'journal-figure-wide' : undefined}><Image src={block.src} alt={i18nText(block.alt)} width={block.width} height={block.height} sizes={block.layout === 'wide' ? '(max-width: 700px) 100vw, 1100px' : '(max-width: 700px) 100vw, 740px'}/>{i18nText((block.caption || block.credit) && <figcaption>{i18nText(block.caption)}{i18nText(block.caption && block.credit && <span aria-hidden="true">{i18nText(" \u00B7 ")}</span>)}{i18nText(block.credit && <span>{i18nText(sourceLabel)}{i18nText(": ")}{i18nText(block.credit)}</span>)}</figcaption>)}</figure>;
}
export function JournalArticle({ post, related, canonicalUrl, authorPhoto }: {
    post: JournalPost;
    related: JournalPost[];
    canonicalUrl: string;
    authorPhoto?: string;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const { locale } = useJournalPreferences();
    const copy = journalCopy[locale];
    const view = journalPostForLocale(post, locale);
    const headings = journalHeadings(view.content);
    const headingIds = new Map(headings.map(heading => [heading.index, heading.id]));
    const textLanguage = view.translated ? undefined : 'pt-BR';
    return <main id="conteudo" className="journal-post-page"><ReadingProgress />
    <article><header className="journal-post-hero section-wrap"><div className="journal-post-head-inner">
      <a className="journal-back" href={i18nHref("/blog")}>{i18nText(copy.back)}</a>
      {i18nText(post.demo && <div className="journal-post-demo" role="note">{i18nText(copy.demo)}</div>)}
      <div className="journal-post-meta"><span>{i18nText(journalCategoryLabels[locale][post.category])}</span></div>
      <h1 lang={textLanguage}>{i18nText(view.title)}</h1>{i18nText(view.summary && <p lang={textLanguage}>{i18nText(view.summary)}</p>)}
      {i18nText(locale === 'en' && !view.translated && <p className="journal-language-note">{i18nText(copy.unavailable)}</p>)}
      <JournalAuthorSignature variant="compact" photo={authorPhoto} date={(post.publishAt || post.date).slice(0, 10)} readingTime={readingMinutes({ ...post, content: view.content })} url={post.status === 'published' && !post.demo ? canonicalUrl : undefined} demo={post.demo}/>
    </div></header>{i18nText(post.cover && <figure className="journal-cover section-wrap"><Image src={post.cover.src} alt={view.coverAlt||post.cover.alt} width={post.cover.width} height={post.cover.height} preload sizes="(max-width: 700px) 100vw, 1100px"/></figure>)}<div className="journal-article-wrap section-wrap"><div className="journal-article-body">
      <div className="journal-article-content" lang={textLanguage}>{view.markdownTree?<MarkdownContent tree={view.markdownTree} title={view.title}/>:i18nText(view.content.map((block, index) => <ArticleBlock key={`${block.type}-${index}`} block={block} id={headingIds.get(index)} sourceLabel={copy.source}/>))}</div>
      {i18nText(post.sources && post.sources.length > 0 && <section className="journal-sources" aria-labelledby="journal-sources-title"><h2 id="journal-sources-title">{i18nText(copy.references)}</h2><ul>{i18nText(post.sources.map(source => <li key={source.url}><a href={i18nHref(source.url)} target="_blank" rel="noopener noreferrer">{i18nText(source.label)}</a></li>))}</ul></section>)}
      <JournalShare variant="end" url={post.status === 'published' && !post.demo ? canonicalUrl : undefined}/>
      <JournalAuthorSignature variant="expanded" photo={authorPhoto} demo={post.demo}/>
    </div></div></article>
    {i18nText(related.length ? <nav className="journal-post-next section-wrap" aria-label={i18nText(copy.relatedLabel)}><h2>{i18nText(copy.related)}</h2><div className="journal-related">{i18nText(related.map(item => {
                const suggestion = journalPostForLocale(item, locale);
                return <a className="journal-related-card" key={item.slug} href={i18nHref(`/blog/${item.slug}`)} onClick={() => trackEvent('journal_related_click', {from_slug: post.slug, to_slug: item.slug, category: item.category})}>
        <span className="journal-related-image">
          {i18nText(item.cover ? <Image src={item.cover.src} alt={suggestion.coverAlt||item.cover.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 48vw, 620px" style={{ objectPosition: item.cover.position || 'center' }}/> : <span className="journal-related-cover-fallback" aria-hidden="true"><small>{i18nText("PAUSA DO CAF\u00C9")}</small><span>{i18nText(journalCategoryLabels[locale][item.category])}</span><strong>{i18nText(suggestion.title)}</strong></span>)}
        </span>
        <span className="journal-related-category">{i18nText(journalCategoryLabels[locale][item.category])}</span>
        <h3 lang={suggestion.translated ? undefined : 'pt-BR'}>{i18nText(suggestion.title)}</h3>
        <span className="journal-related-summary" lang={suggestion.translated ? undefined : 'pt-BR'}>{i18nText(suggestion.summary)}</span>
        <span className="journal-related-meta"><span>{i18nText(copy.reading(readingMinutes({ ...item, content: suggestion.content })))}</span><span className="journal-related-arrow" aria-hidden="true">{i18nText("\u2197")}</span></span>
      </a>;
            }))}</div></nav> : <nav className="journal-post-next journal-post-next-empty section-wrap" aria-label={i18nText(copy.relatedLabel)}><p>{i18nText(copy.relatedEmpty)}</p><a href={i18nHref("/blog")}>{i18nText(copy.backFull)}</a></nav>)}
    <Newsletter variant="article"/>
  </main>;
}
