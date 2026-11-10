import generatedPosts from './journal-generated.json';

export const journalCategories = {
  'identidade-visual': 'Identidade visual', branding: 'Branding',
  'direcao-de-arte': 'Direção de arte', processo: 'Processo',
  tecnologia: 'Tecnologia', referencias: 'Referências',
} as const;

export type JournalCategory = keyof typeof journalCategories;
export type JournalInline = {text: string; href?: string};
export type MarkdownNode={type:string;value?:string;depth?:number;id?:string;url?:string;alt?:string|null;title?:string|null;lang?:string|null;ordered?:boolean;start?:number|null;identifier?:string;label?:string;children?:MarkdownNode[]};
export type JournalBlock =
  | {type: 'paragraph'; text: string; segments?: never}
  | {type: 'paragraph'; segments: JournalInline[]; text?: never}
  | {type: 'heading'; level: 2 | 3; text: string}
  | {type: 'list'; items: string[]}
  | {type: 'quote'; text: string; attribution?: string}
  | {type: 'image'; src: string; alt: string; width: number; height: number; caption?: string; credit?: string; layout?: 'column' | 'wide'};

export type JournalPost = {
  title: string; slug: string; summary: string; category: JournalCategory;
  date: string; // YYYY-MM-DD; para posts publicados, use a data real da publicação.
  updatedAt?: string; // YYYY-MM-DD; somente quando o artigo tiver sido atualizado.
  publishAt?: string; // Horário absoluto gerado de publish_at em America/Fortaleza.
  status: 'draft' | 'published'; content: JournalBlock[];
  cover?: {src: string; alt: string; width: number; height: number; position?: string};
  tags?: string[];
  demo?: boolean; // Conteúdo de teste preservado para revisão, mas fora das listagens públicas.
  sources?: {label: string; url: string}[];
  seo?: {title?: string; description?: string};
  markdownTree?:MarkdownNode;
  translations?: {en?: {title: string; summary: string; content: JournalBlock[];markdownTree?:MarkdownNode;seo?:{title?:string;description?:string};coverAlt?:string}};
};

const editorialFixtures: JournalPost[] = [
  {title:'O que uma identidade visual precisa ter além do logo',slug:'alem-do-logo',summary:'Um roteiro de perguntas sobre sistema visual, consistência e uso real da marca.',category:'identidade-visual',date:'',status:'draft',content:[
    {type:'heading',level:2,text:'O que a marca precisa comunicar'},
    {type:'heading',level:2,text:'Elementos que formam o sistema'},
    {type:'heading',level:2,text:'Aplicações e critérios de uso'},
  ]},
  {title:'Quando é hora de redesenhar a marca de um negócio que cresceu',slug:'quando-redesenhar-a-marca',summary:'Sinais para avaliar se a identidade ainda acompanha o negócio e o que mudou.',category:'branding',date:'',status:'draft',content:[
    {type:'heading',level:2,text:'O que mudou no negócio'},
    {type:'heading',level:2,text:'O que ainda funciona'},
    {type:'heading',level:2,text:'Critérios para uma nova direção'},
  ]},
  {title:'Por que começo um projeto sem abrir o Photoshop',slug:'antes-do-photoshop',summary:'Notas sobre escuta, perguntas e decisões que antecedem a primeira peça visual.',category:'processo',date:'',status:'draft',content:[
    {type:'heading',level:2,text:'Entender antes de desenhar'},
    {type:'heading',level:2,text:'Perguntas que orientam o trabalho'},
    {type:'heading',level:2,text:'Da direção à construção'},
  ]},
];
export const journalPosts: JournalPost[] = [...generatedPosts as JournalPost[], ...editorialFixtures];
function newestPublicationFirst(a: JournalPost, b: JournalPost) {
  return Date.parse(b.publishAt || b.date) - Date.parse(a.publishAt || a.date);
}

export const publishedJournalPosts = journalPosts.filter(post => post.status === 'published' && !post.demo).sort(newestPublicationFirst);
export const publishedJournalCategories = [...new Set(publishedJournalPosts.map(post => post.category))];
export const showJournalNavigation = true;
export const indexJournal = publishedJournalPosts.length >= 1;
// Published posts and layout demos stay available on their direct routes and in
// the public index. Sitemap, feeds and recommendations use published posts only.
export const visibleJournalPosts = journalPosts
  .filter(post => post.status === 'published' || post.demo)
  .sort(newestPublicationFirst);
export const visibleJournalCategories = [...new Set(visibleJournalPosts.map(post => post.category))];
export const getVisibleJournalPost = (slug: string) => visibleJournalPosts.find(post => post.slug === slug);

export function relatedJournalPosts(post: JournalPost, candidates = publishedJournalPosts, limit = 2) {
  const eligible = candidates.filter(item => item.slug !== post.slug && item.status === 'published' && !item.demo);
  const tags = new Set((post.tags || []).map(tag => tag.trim().toLocaleLowerCase()).filter(Boolean));
  const ranked = eligible.map(item => {
    const sharedTags = (item.tags || []).filter(tag => tags.has(tag.trim().toLocaleLowerCase())).length;
    return {item, score: (item.category === post.category ? 2 : 0) + sharedTags * 3};
  });
  const contextual = ranked.filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
    .map(entry => entry.item);
  return contextual.slice(0, limit);
}
export function readingMinutes(post: JournalPost) {
  const words = post.content.flatMap(block => {
    if (block.type === 'paragraph') return [block.text ?? block.segments.map(segment => segment.text).join(' ')];
    if (block.type === 'heading' || block.type === 'quote') return [block.text];
    if (block.type === 'list') return block.items;
    return [];
  }).join(' ').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}
