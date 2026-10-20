import type {MetadataRoute} from 'next';
export const dynamic='force-static';
import {projects} from '@/content/projects';
import {publishedJournalPosts,indexJournal} from '@/content/journal';
export default function sitemap():MetadataRoute.Sitemap{const url=(process.env.NEXT_PUBLIC_SITE_URL||'https://mario-serafim-portfolio-2026.mario-92.chatgpt.site').replace(/\/$/,'');const categories=[...new Set(publishedJournalPosts.map(post=>post.category))];return ['','/projetos','/sobre','/contato','/privacidade',...(indexJournal?['/blog',...categories.map(category=>`/blog/categoria/${category}`)]:[]),...projects.map(p=>`/projetos/${p.slug}`),...publishedJournalPosts.map(p=>`/blog/${p.slug}`)].map(path=>({url:`${url}${path}`,changeFrequency:'monthly',priority:path===''?1:.7}))}
