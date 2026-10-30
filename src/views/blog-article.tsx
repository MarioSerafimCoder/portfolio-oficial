import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVisibleJournalPost, publishedJournalPosts, relatedJournalPosts, visibleJournalPosts } from '@/content/journal';
import { JournalArticle } from '@/components/journal-article';
import '@/app/blog/blog.css';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '@/content/site';
import {journalPostForLocale} from '@/content/journal-i18n';
import {localizedHref} from '@/i18n/routes';
type Props = {
    params: Promise<{
        slug: string;
    }>;
};
export const dynamicParams = false;
export function generateStaticParams() {
    // A exportação estática exige ao menos um parâmetro. Enquanto o blog estiver
    // vazio, esta rota reservada gera apenas um 404 e não entra na navegação/sitemap.
    return visibleJournalPosts.length
        ? visibleJournalPosts.map(({ slug }) => ({ slug }))
        : [{ slug: '__sem-publicacoes__' }];
}
export async function generateMetadata({ params,locale='pt' }: Props&{locale?:SiteLocale}): Promise<Metadata> {
    const { slug } = await params;
    const post = getVisibleJournalPost(slug);
    if (!post)
        return { robots: { index: false, follow: false } };
    const view=journalPostForLocale(post,locale);
    const title = view.seo?.title || view.title;
    const description = view.seo?.description || view.summary;
    if (post.status !== 'published' || post.demo)
        return { title, description, robots: { index: false, follow: false } };
    const image = post.cover?.src || '/opengraph-image';
    return { title, description, alternates: { canonical: `/blog/${slug}` }, openGraph: { type: 'article', title, description, url: `/blog/${slug}`, images: [{ url: image, alt: view.coverAlt || view.title }], publishedTime: post.publishAt || post.date, ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}), authors: ['Mário Serafim'] }, twitter: { card: 'summary_large_image', title, description, images: [image] } };
}
export default async function JournalPost({ params, locale = "pt" }: Props & {
    locale?: SiteLocale;
}) {
    const { i18nText, i18nHref } = createTranslator(locale);
    const { slug } = await params;
    const post = getVisibleJournalPost(slug);
    if (!post)
        notFound();
    if(locale==='en'&&!post.translations?.en)notFound();
    const view=journalPostForLocale(post,locale);
    const candidates = publishedJournalPosts.filter(item => locale === 'pt' || item.translations?.en);
    const latestPosts = relatedJournalPosts(post, candidates, 3);
    const canonicalUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://marioserafim.com.br').replace(/\/$/, '')}${localizedHref(`/blog/${post.slug}`,locale)}`;
    const structuredData = [{ '@context': 'https://schema.org', '@type': 'Article', headline: view.title, description: view.summary, datePublished: post.publishAt || post.date, ...(post.updatedAt ? { dateModified: post.updatedAt } : {}), ...(post.cover ? { image: `${(process.env.NEXT_PUBLIC_SITE_URL||'https://marioserafim.com.br').replace(/\/$/,'')}${post.cover.src}` } : {}), inLanguage: locale==='en'?'en':'pt-BR', author: { '@type': 'Person', name: site.name, jobTitle: locale==='en'?'Art director':'Diretor de arte', url: canonicalUrl.replace(/\/blog\/[^/]+$/, ''), sameAs: [site.linkedin] }, mainEntityOfPage: canonicalUrl }, { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: locale==='en'?'Home':'Início', item: canonicalUrl.replace(/\/blog\/[^/]+$/, '') }, { '@type': 'ListItem', position: 2, name: 'Pausa do café', item: canonicalUrl.replace(/\/[^/]+$/, '') }, { '@type': 'ListItem', position: 3, name: view.title, item: canonicalUrl }] }];
    const authorPhoto = existsSync(join(process.cwd(), 'public', site.authorPhoto.replace(/^\//, ''))) ? site.authorPhoto : undefined;
    return <>{i18nText(post.status === 'published' && !post.demo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}/>)}<JournalArticle post={post} latestPosts={latestPosts} canonicalUrl={canonicalUrl} authorPhoto={authorPhoto}/></>;
}
