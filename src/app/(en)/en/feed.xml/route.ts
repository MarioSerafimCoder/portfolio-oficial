import {publishedJournalPosts} from '@/content/journal';
export const dynamic='force-static';
const escape=(value:string)=>value.replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]!));
export function GET(){
 const origin=(process.env.NEXT_PUBLIC_SITE_URL||'https://marioserafim.com.br').replace(/\/$/,'');
 const posts=publishedJournalPosts.filter(post=>post.translations?.en);
 const items=posts.map(post=>{const view=post.translations!.en!;const url=origin+'/en/blog/'+post.slug;return `<item><title>${escape(view.title)}</title><description>${escape(view.summary)}</description><link>${url}</link><guid>${url}</guid><pubDate>${new Date(post.publishAt||post.date).toUTCString()}</pubDate></item>`;}).join('');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Pausa do café — Mário Serafim</title><link>${origin}/en/blog</link><description>Notes on design, creativity and technology.</description><language>en</language>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
}
