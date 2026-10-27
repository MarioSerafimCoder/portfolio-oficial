import generatedPosts from './journal-generated.json';
import {journalDemoEnglish} from './journal-demo-en';

export const journalCategories = {
  'identidade-visual': 'Identidade visual', branding: 'Branding',
  'direcao-de-arte': 'Direção de arte', processo: 'Processo',
  tecnologia: 'Tecnologia', referencias: 'Referências',
} as const;

export type JournalCategory = keyof typeof journalCategories;
export type JournalInline = {text: string; href?: string};
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
  demo?: boolean; // Exemplo visível em Pausa do café, rotulado como teste e excluído da indexação.
  sources?: {label: string; url: string}[];
  seo?: {title?: string; description?: string};
  translations?: {en?: {title: string; summary: string; content: JournalBlock[]}};
};

// O exemplo permite avaliar o template; aparece com aviso de teste e não é uma publicação.
const editorialFixtures: JournalPost[] = [{
  title: 'Post de teste: o que faz a gente continuar lendo?',
  slug: 'exemplo-de-leitura',
  summary: 'Uma demonstração da página de artigo: hierarquia, respiro, imagem, links e referências em uma leitura sem distrações.',
  category: 'tecnologia',
  date: '2026-10-20',
  status: 'draft',
  demo: true,
  seo: {title: 'Exemplo de leitura em Pausa do café', description: 'Post de teste do template editorial de Pausa do café.'},
  translations: {en: {title: 'Test post: what keeps us reading?', summary: 'A preview of the article page: hierarchy, breathing room, imagery, links and references in a reading experience without distractions.', content: journalDemoEnglish}},
  content: [
    {type: 'paragraph', text: 'Este texto é uma demonstração de Pausa do café. Ele serve para avaliar a experiência de leitura e não representa um artigo publicado ou o relato de um projeto novo.'},
    {type: 'paragraph', text: 'Uma página pode ter boas ideias e ainda assim ser difícil de acompanhar. Às vezes o problema não está na frase: está no caminho que o olhar precisa percorrer para encontrá-la. Tamanho do texto, largura da coluna, intervalos e títulos interferem nesse percurso.'},
    {type: 'heading', level: 2, text: 'Antes da primeira frase'},
    {type: 'paragraph', text: 'Quem chega a um artigo costuma procurar pistas antes de decidir se fica. O título sugere uma pergunta; a introdução mostra por que ela importa; os subtítulos antecipam a direção da conversa. Nada disso precisa entregar uma resposta pronta, mas deve ajudar a pessoa a se orientar.'},
    {type: 'paragraph', segments: [
      {text: 'A '},
      {text: 'orientação do W3C sobre headings', href: 'https://www.w3.org/WAI/tutorials/page-structure/headings/'},
      {text: ' lembra que títulos também organizam o conteúdo para quem navega com tecnologias assistivas. Hierarquia visual e estrutura semântica precisam contar a mesma história.'},
    ]},
    {type: 'heading', level: 3, text: 'Três perguntas úteis'},
    {type: 'list', items: [
      'O título diz com clareza sobre o que é o texto?',
      'Cada seção desenvolve uma ideia reconhecível?',
      'O próximo parágrafo convida a continuar sem esconder o assunto?',
    ]},
    {type: 'quote', text: 'Uma página confortável não força a leitura. Ela tira obstáculos do caminho.', attribution: 'Trecho demonstrativo'},
    {type: 'heading', level: 2, text: 'O ritmo também comunica'},
    {type: 'paragraph', text: 'Uma coluna muito larga exige que o olhar percorra uma distância grande a cada linha. Uma coluna estreita demais fragmenta o pensamento. O melhor ponto depende da fonte, do tamanho, do dispositivo e do tipo de conteúdo. É uma decisão para testar, não um número mágico.'},
    {type: 'paragraph', segments: [
      {text: 'O guia de '},
      {text: 'tipografia do web.dev', href: 'https://web.dev/learn/design/typography/'},
      {text: ' reúne fatores que ajudam nessa avaliação, como tamanho do texto, comprimento das linhas e espaço entre elas. Aqui, a coluna central procura dar presença ao texto sem deixá-lo cansativo.'},
    ]},
    {type: 'image', src: '/media/rooftop-01.webp', width: 1920, height: 1080, alt: 'Capa da apresentação editorial do estudo conceitual Rooftop Arquitetura', caption: 'Exemplo de hierarquia visual em uma apresentação do estudo conceitual Rooftop Arquitetura. Imagem do acervo do portfólio.'},
    {type: 'paragraph', text: 'A imagem acima ilustra uma escolha editorial: criar uma entrada clara antes de mostrar detalhes. Ela não é necessária para entender este texto; por isso a página também precisa funcionar quando um artigo tiver somente palavras.'},
    {type: 'heading', level: 2, text: 'Ler é encontrar um caminho'},
    {type: 'paragraph', text: 'Separadores, legendas e referências têm funções diferentes. Um separador indica mudança de assunto. Uma legenda explica o que a imagem acrescenta. Uma referência permite conferir a origem de uma informação. Quando cada elemento cumpre um papel, a página fica mais simples.'},
    {type: 'paragraph', segments: [
      {text: 'No '},
      {text: 'case Rooftop', href: '/projetos/rooftop'},
      {text: ', a apresentação editorial mostra como um mesmo sistema visual pode organizar conteúdos de escalas diferentes. Aqui a intenção é semelhante: oferecer uma sequência reconhecível para que o leitor escolha onde se aprofundar.'},
    ]},
    {type: 'paragraph', text: 'Este exemplo termina sem uma conclusão definitiva. Na revisão de um artigo real, a pergunta mais útil talvez seja simples: depois de ler, a pessoa consegue distinguir a ideia principal, as observações do autor e as fontes que sustentam os fatos?'},
  ],
  sources: [
    {label: 'W3C WAI — Headings', url: 'https://www.w3.org/WAI/tutorials/page-structure/headings/'},
    {label: 'web.dev — Typography', url: 'https://web.dev/learn/design/typography/'},
  ],
},
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
export const publishedJournalPosts = journalPosts.filter(post => post.status === 'published' && !post.demo).sort((a, b) => b.date.localeCompare(a.date));
export const showJournalNavigation = true;
export const indexJournal = publishedJournalPosts.length >= 3;
export const visibleJournalPosts = journalPosts
  .filter(post => post.status === 'published' || post.demo)
  .sort((a, b) => b.date.localeCompare(a.date));
export const getVisibleJournalPost = (slug: string) => visibleJournalPosts.find(post => post.slug === slug);
export function readingMinutes(post: JournalPost) {
  const words = post.content.flatMap(block => {
    if (block.type === 'paragraph') return [block.text ?? block.segments.map(segment => segment.text).join(' ')];
    if (block.type === 'heading' || block.type === 'quote') return [block.text];
    if (block.type === 'list') return block.items;
    return [];
  }).join(' ').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}
