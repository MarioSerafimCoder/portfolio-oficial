import {journalCategories, publishedJournalPosts} from '@/content/journal';

export const dynamic = 'force-static';

const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mario-serafim-portfolio-2026.mario-92.chatgpt.site').replace(/\/$/, '');
const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export function GET() {
  const items = publishedJournalPosts.map(post => {
    const link = `${origin}/blog/${post.slug}`;
    return `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><description>${escapeXml(post.summary)}</description><category>${escapeXml(journalCategories[post.category])}</category><pubDate>${new Date(post.publishAt || `${post.date}T12:00:00Z`).toUTCString()}</pubDate></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Pausa do café — Mário Serafim</title><link>${escapeXml(`${origin}/blog`)}</link><description>Reflexões sobre design, direção de arte e processos criativos.</description><language>pt-BR</language>${items}</channel></rss>`;
  return new Response(xml, {headers: {'Content-Type': 'application/rss+xml; charset=utf-8'}});
}
