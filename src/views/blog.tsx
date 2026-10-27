import type {Metadata} from 'next';
import {visibleJournalPosts,indexJournal} from '@/content/journal';
import {JournalIndex} from '@/components/journal-index';
import '@/app/blog/blog.css';

export const metadata: Metadata = {
  title: 'Pausa do café — textos sobre design e direção de arte',
  description: 'Reflexões de Mário Serafim sobre design, direção de arte, branding, processos criativos, tecnologia e referências.',
  robots:{index:indexJournal,follow:true},
  alternates: {canonical: '/blog', types: {'application/rss+xml': '/feed.xml'}},
  openGraph: {title: 'Pausa do café — Mário Serafim', description: 'Reflexões sobre o mundo criativo por Mário Serafim.', url: '/blog', type: 'website',images:[{url:'/opengraph-image',alt:'Pausa do café, blog de Mário Serafim'}]},
  twitter:{card:'summary_large_image',title:'Pausa do café — Mário Serafim',description:'Reflexões sobre design e direção de arte.',images:['/opengraph-image']},
};

export default function BlogPage({locale='pt'}:{locale?:'pt'|'en'}={}) {
  return <JournalIndex posts={visibleJournalPosts.filter(post=>locale==='pt'||post.translations?.en)}/>;
}
