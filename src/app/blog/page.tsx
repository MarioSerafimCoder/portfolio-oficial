import type {Metadata} from 'next';
import {visibleJournalPosts} from '@/content/journal';
import {JournalIndex} from '@/components/journal-index';
import './blog.css';

export const metadata: Metadata = {
  title: 'Diário de bordo',
  description: 'Reflexões de Mário Serafim sobre design, direção de arte, branding, processos criativos, tecnologia e referências.',
  alternates: {canonical: '/blog', types: {'application/rss+xml': '/blog/feed.xml'}},
  openGraph: {title: 'Pausa do café — Diário de bordo', description: 'Reflexões sobre o mundo criativo por Mário Serafim.', url: '/blog', type: 'website'},
};

export default function BlogPage() {
  return <JournalIndex posts={visibleJournalPosts}/>;
}
