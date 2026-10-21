'use client';

import Image from 'next/image';
import Link from 'next/link';
import {journalHeadings} from '@/lib/journal-headings';
import {readingMinutes, type JournalBlock, type JournalPost} from '@/content/journal';
import {formatJournalDateLocale, journalCategoryLabels, journalCopy, journalPostForLocale} from '@/content/journal-i18n';
import {useJournalPreferences} from './journal-preferences';
import {JournalShare} from './journal-share';
import {Newsletter} from './newsletter';
import {site} from '@/content/site';
import {ReadingProgress} from './reading-progress';

function ArticleBlock({block, id, sourceLabel}: {block: JournalBlock; id?: string; sourceLabel: string}) {
  if (block.type === 'paragraph') return <p>{block.segments ? block.segments.map((segment, index) => segment.href
    ? <a key={index} href={segment.href} {...(/^https?:\/\//.test(segment.href) ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>{segment.text}</a>
    : <span key={index}>{segment.text}</span>) : block.text}</p>;
  if (block.type === 'heading') return block.level === 2 ? <h2 id={id}>{block.text}</h2> : <h3 id={id}>{block.text}</h3>;
  if (block.type === 'list') return <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
  if (block.type === 'quote') return <blockquote><p>{block.text}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>;
  return <figure className={block.layout === 'wide' ? 'journal-figure-wide' : undefined}><Image src={block.src} alt={block.alt} width={block.width} height={block.height} sizes={block.layout === 'wide' ? '(max-width: 700px) 100vw, 1100px' : '(max-width: 700px) 100vw, 740px'}/>{(block.caption || block.credit) && <figcaption>{block.caption}{block.caption && block.credit && <span aria-hidden="true"> · </span>}{block.credit && <span>{sourceLabel}: {block.credit}</span>}</figcaption>}</figure>;
}

export function JournalArticle({post, related, canonicalUrl, authorPhoto}: {post: JournalPost; related: JournalPost[]; canonicalUrl: string;authorPhoto?:string}) {
  const {locale} = useJournalPreferences();
  const copy = journalCopy[locale];
  const view = journalPostForLocale(post, locale);
  const headings = journalHeadings(view.content);
  const headingIds = new Map(headings.map(heading => [heading.index, heading.id]));
  const textLanguage = view.translated ? undefined : 'pt-BR';
  return <main id="conteudo" className="journal-post-page"><ReadingProgress/>
    <article><header className="journal-post-hero section-wrap"><div className="journal-post-head-inner">
      <Link className="journal-back" href="/blog">{copy.back}</Link>
      {post.demo && <div className="journal-post-demo" role="note">{copy.demo}</div>}
      <div className="journal-post-meta"><span>{journalCategoryLabels[locale][post.category]}</span></div>
      <h1 lang={textLanguage}>{view.title}</h1>{view.summary && <p lang={textLanguage}>{view.summary}</p>}
      {locale === 'en' && !view.translated && <p className="journal-language-note">{copy.unavailable}</p>}
      <div className="journal-post-byline"><span>{post.demo ? copy.demoAuthor : 'Mário Serafim'}</span><time dateTime={post.date}>{formatJournalDateLocale(post.date, locale, true)}</time><span>{copy.reading(readingMinutes({...post, content: view.content}))}</span></div>
    </div></header>{post.cover&&<figure className="journal-cover section-wrap"><Image src={post.cover.src} alt={post.cover.alt} width={post.cover.width} height={post.cover.height} priority sizes="(max-width: 700px) 100vw, 1100px"/></figure>}<div className="journal-article-wrap section-wrap"><div className="journal-article-body">
      {headings.length >= 3 && <nav className="journal-toc" aria-label={copy.tocLabel}><details><summary>{copy.toc} <span aria-hidden="true">⌄</span></summary><ol>{headings.map(heading => <li key={heading.id} className={heading.level === 3 ? 'journal-toc-sub' : undefined}><a href={`#${heading.id}`} lang={textLanguage}>{heading.text}</a></li>)}</ol></details></nav>}
      <div className="journal-article-content" lang={textLanguage}>{view.content.map((block, index) => <ArticleBlock key={`${block.type}-${index}`} block={block} id={headingIds.get(index)} sourceLabel={copy.source}/>)}</div>
      {post.sources && post.sources.length > 0 && <section className="journal-sources" aria-labelledby="journal-sources-title"><h2 id="journal-sources-title">{copy.references}</h2><ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></section>}
      <JournalShare url={post.status === 'published' && !post.demo ? canonicalUrl : undefined}/>
      <aside className="journal-author" aria-label={locale==='en'?'About the author':'Sobre o autor'}>{authorPhoto&&<Image src={authorPhoto} alt="Retrato de Mário Serafim" width={72} height={72}/>}<div><strong>{site.name}</strong><p>{copy.authorBio}</p></div></aside>
    </div></div></article>
    {related.length ? <nav className="journal-post-next section-wrap" aria-label={copy.relatedLabel}><h2>{copy.related}</h2><div className="journal-related">{related.map(item => {
      const suggestion = journalPostForLocale(item, locale);
      return <Link key={item.slug} href={`/blog/${item.slug}`}><span>{journalCategoryLabels[locale][item.category]}</span><strong lang={suggestion.translated ? undefined : 'pt-BR'}>{suggestion.title}</strong><small lang={suggestion.translated ? undefined : 'pt-BR'}>{suggestion.summary}</small><span aria-hidden="true">{copy.readArticle}</span></Link>;
    })}</div></nav> : <nav className="journal-post-next journal-post-next-empty section-wrap" aria-label={copy.backFull}><Link href="/blog">{copy.backFull}</Link></nav>}
    <Newsletter/>
  </main>;
}
