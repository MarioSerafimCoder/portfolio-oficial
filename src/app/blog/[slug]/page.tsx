import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getVisibleJournalPost, publishedJournalPosts, visibleJournalPosts} from '@/content/journal';
import {JournalArticle} from '@/components/journal-article';
import '../blog.css';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {site} from '@/content/site';

type Props = {params: Promise<{slug: string}>};
export const dynamicParams = false;
export function generateStaticParams() {
  // A exportação estática exige ao menos um parâmetro. Enquanto o blog estiver
  // vazio, esta rota reservada gera apenas um 404 e não entra na navegação/sitemap.
  return visibleJournalPosts.length
    ? visibleJournalPosts.map(({slug}) => ({slug}))
    : [{slug: '__sem-publicacoes__'}];
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const post = getVisibleJournalPost(slug);
  if (!post) return {robots: {index: false, follow: false}};
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.summary;
  if (post.status !== 'published' || post.demo) return {title, description, robots: {index: false, follow: false}};
  const image=post.cover?.src||'/opengraph-image';
  return {title, description, alternates: {canonical: `/blog/${slug}`}, openGraph: {type: 'article', title, description, url: `/blog/${slug}`,images:[{url:image,alt:post.cover?.alt||post.title}], publishedTime: post.publishAt || post.date, ...(post.updatedAt ? {modifiedTime: post.updatedAt} : {}), authors: ['Mário Serafim']}, twitter: {card: 'summary_large_image', title, description,images:[image]}};
}

export default async function JournalPost({params}: Props) {
  const {slug} = await params;
  const post = getVisibleJournalPost(slug);
  if (!post) notFound();
  const related = publishedJournalPosts.filter(item => item.slug !== slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 2);
  const canonicalUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://marioserafim.com.br').replace(/\/$/, '')}/blog/${post.slug}`;
  const structuredData = [{'@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.summary, datePublished: post.publishAt || post.date, ...(post.updatedAt ? {dateModified: post.updatedAt} : {}), ...(post.cover ? {image:`${canonicalUrl.replace(/\/blog\/[^/]+$/,'')}${post.cover.src}`} : {}), inLanguage: 'pt-BR', author: {'@type': 'Person', name: 'Mário Serafim'}, mainEntityOfPage: canonicalUrl},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Início',item:canonicalUrl.replace(/\/blog\/[^/]+$/,'')},{'@type':'ListItem',position:2,name:'Pausa do café',item:canonicalUrl.replace(/\/[^/]+$/,'')},{'@type':'ListItem',position:3,name:post.title,item:canonicalUrl}]}];
  const authorPhoto=existsSync(join(process.cwd(),'public',site.authorPhoto.replace(/^\//,'')))?site.authorPhoto:undefined;
  return <>{post.status === 'published' && !post.demo && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, '\\u003c')}}/>}<JournalArticle post={post} related={related} canonicalUrl={canonicalUrl} authorPhoto={authorPhoto}/></>;
}
