import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {journalCategories,publishedJournalPosts,visibleJournalPosts,visibleJournalCategories,indexJournal,type JournalCategory} from '@/content/journal';
import {JournalIndex} from '@/components/journal-index';
import '@/app/blog/blog.css';

type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){
  const categories=visibleJournalCategories;
  return categories.length?categories.map(slug=>({slug})):[{slug:'__sem-publicacoes__'}];
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  const category=journalCategories[slug as JournalCategory];
  if(!category)return {robots:{index:false,follow:false}};
  const title=`${category} — Pausa do café`;
  const description=`Textos de Mário Serafim sobre ${category.toLocaleLowerCase('pt-BR')}.`;
  return {title,description,robots:{index:indexJournal&&publishedJournalPosts.some(post=>post.category===slug),follow:true},alternates:{canonical:`/blog/categoria/${slug}`},openGraph:{title,description,url:`/blog/categoria/${slug}`}};
}
export default async function CategoryPage({params,locale='pt'}:Props&{locale?:'pt'|'en'}){
  const {slug}=await params;
  if(!journalCategories[slug as JournalCategory]||!visibleJournalPosts.some(post=>post.category===slug))notFound();
  return <JournalIndex posts={visibleJournalPosts.filter(post=>locale==='pt'||post.translations?.en)} activeCategory={slug as JournalCategory}/>;
}
