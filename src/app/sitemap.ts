import type {MetadataRoute} from 'next';
export const dynamic='force-static';
import {projects} from '@/content/projects';
import {publishedJournalPosts,publishedJournalCategories,indexJournal} from '@/content/journal';
import {languagePeer} from '@/i18n/routes';
export default function sitemap():MetadataRoute.Sitemap{
 const origin=(process.env.NEXT_PUBLIC_SITE_URL||'https://marioserafim.com.br').replace(/\/$/,'');
 const paths=['/','/projetos','/sobre','/contato','/privacidade',...(indexJournal?['/blog',...publishedJournalCategories.map(category=>`/blog/categoria/${category}`)]:[]),...projects.map(project=>`/projetos/${project.slug}`),...publishedJournalPosts.map(post=>`/blog/${post.slug}`)];
 return paths.flatMap(path=>{
  const en=languagePeer(path,'en');
  const languages={'pt-BR':origin+(path==='/'?'':path),...(en?{en:origin+en}:{}),'x-default':origin+(path==='/'?'':path)};
  return [path,...(en?[en]:[])].map(url=>({url:origin+(url==='/'?'':url),changeFrequency:'monthly' as const,priority:path==='/'?1:.7,alternates:{languages}}));
 });
}
