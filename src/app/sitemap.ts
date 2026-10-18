import type {MetadataRoute} from 'next';
export const dynamic='force-static';
import {projects} from '@/content/projects';
export default function sitemap():MetadataRoute.Sitemap{const url=process.env.NEXT_PUBLIC_SITE_URL||'https://mario-serafim-portfolio-2026.mario-92.chatgpt.site';return ['','/projetos','/sobre','/contato',...projects.map(p=>`/projetos/${p.slug}`)].map(path=>({url:`${url}${path}`,changeFrequency:'monthly',priority:path===''?1:.7}))}
