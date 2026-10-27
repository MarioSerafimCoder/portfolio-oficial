export const site = {
  name: 'Mário Serafim',
  email: 'contato@marioserafim.com.br',
  linkedin: 'https://www.linkedin.com/in/marioserafim/',
  instagram: 'https://www.instagram.com/marioserafims/',
  behance: 'https://www.behance.net/mario-serafim',
  whatsapp: '5585981866552',
  authorPhoto: '/media/mario-serafim-avatar-mirror.webp',
  bookingUrl: '', // TODO(Mário): informar o link da agenda para ativar o botão.
  responseBusinessDays: null as number | null, // TODO(Mário): definir prazo real de resposta.
  investmentRanges: [
    'Ainda estou definindo', 'Até R$ 2.000', 'R$ 2.000 a R$ 5.000',
    'R$ 5.000 a R$ 10.000', 'Acima de R$ 10.000',
  ], // TODO(Mário): revisar as faixas antes de divulgá-las como referência definitiva.
  processTiming: {discovery: '', direction: '', delivery: ''}, // TODO(Mário): preencher somente com prazos confirmados.
  location: 'Fortaleza, Ceará, Brasil',
  description: 'Direção de arte, identidade visual e experiências digitais por Mário Serafim, diretor de arte em Fortaleza, Ceará.',
};
export const services = [
  {title:'Identidade visual', line:'Não é só criar um símbolo e torcer pra dar certo. É construir uma linguagem que as pessoas reconheçam onde quer que a marca apareça.', text:'Desenvolvimento de sistemas visuais que dão consistência à maneira como uma marca se apresenta.', scope:'Assinatura visual · Sistema gráfico · Paleta · Tipografia · Aplicações · Diretrizes de uso'},
  {title:'Branding', line:'Antes de decidir como a marca vai aparecer, precisamos descobrir o que ela tem a dizer. Pular essa parte parece ganhar tempo. Quase nunca ganha.', text:'Definição de fundamentos estratégicos que orientam o posicionamento e sua expressão visual.', scope:'Diagnóstico · Posicionamento · Atributos · Território de expressão'},
  {title:'Direção de arte', line:'Campanhas, imagens e peças que conversam entre si. Porque cada publicação inventar uma personalidade nova não é estratégia.', text:'Criação de linguagens visuais consistentes para campanhas, peças editoriais e experiências de marca.', scope:'Conceito visual · Direção estética · Composição · Campanhas · Peças editoriais'},
  {title:'Experiências digitais', line:'Um site pode ser bonito, mas, se ninguém entende onde clicar, alguma coisa saiu errada. Gosto de interfaces em que identidade e experiência funcionam juntas.', text:'Interfaces digitais que conectam linguagem visual, clareza de navegação e experiência de uso.', scope:'Interface · Website · UX/UI · Comunicação digital'},
];

export const generalFaq = [
  {question:'O que está incluso em um projeto?', answer:'O escopo é definido em uma proposta para a necessidade de cada marca. Antes de começar, alinhamos entregas, aplicações e etapas.'},
  {question:'Como funciona o pagamento?', answer:'As condições de pagamento são apresentadas na proposta, junto com o escopo e as etapas do projeto.'}, // TODO(Mário): detalhar as condições quando estiverem definidas.
  {question:'Como começamos?', answer:'Você me conta um pouco sobre o negócio e o que precisa resolver. Depois conversamos para entender o contexto e definir os próximos passos.'},
];
