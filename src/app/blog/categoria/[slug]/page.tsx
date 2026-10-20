import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {journalCategories,publishedJournalPosts,indexJournal,type JournalCategory} from '@/content/journal';
import {JournalIndex} from '@/components/journal-index';
import '../../blog.css';

type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){
  const categories=[...new Set(publishedJournalPosts.map(post=>post.category))];
  return categories.length?categories.map(slug=>({slug})):[{slug:'__sem-publicacoes__'}];
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  const category=journalCategories[slug as JournalCategory];
  if(!category)return {robots:{index:false,follow:false}};
  const title=`${category} — Pausa do café`;
  const description=`Textos de Mário Serafim sobre ${category.toLocaleLowerCase('pt-BR')}.`;
  return {title,description,robots:{index:indexJournal,follow:true},alternates:{canonical:`/blog/categoria/${slug}`},openGraph:{title,description,url:`/blog/categoria/${slug}`}};
}
export default async function CategoryPage({params}:Props){
  const {slug}=await params;
  if(!journalCategories[slug as JournalCategory]||!publishedJournalPosts.some(post=>post.category===slug))notFound();
  return <JournalIndex posts={publishedJournalPosts} activeCategory={slug as JournalCategory}/>;
}
