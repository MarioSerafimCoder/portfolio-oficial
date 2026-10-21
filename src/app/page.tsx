import Link from 'next/link';
import Image from 'next/image';
import {ProjectCard} from '@/components/projects';
import {Services} from '@/components/services';
import {ProcessSteps} from '@/components/process-steps';
import {projects} from '@/content/projects';
import {Arrow} from '@/components/shell';
import './home.css';
import type {Metadata} from 'next';
import {site,generalFaq} from '@/content/site';
import {socialLinks} from '@/lib/site-links';
import {TrackedLink} from '@/components/tracked-link';
import {ScrollHighlight} from '@/components/scroll-highlight';

const origin=(process.env.NEXT_PUBLIC_SITE_URL||'https://mario-serafim-portfolio-2026.mario-92.chatgpt.site').replace(/\/$/,'');
export const metadata:Metadata={title:'Direção de arte, identidade visual e branding em Fortaleza',description:'Portfólio de Mário Serafim: direção de arte, identidade visual, branding e experiências digitais desenvolvidas com clareza e personalidade.',alternates:{canonical:'/'},openGraph:{title:'Mário Serafim — Direção de arte e identidade visual',description:site.description,url:'/'}};

const featured=['rooftop','simetria','eduardo-noronha','amanda-araujo'].map(slug=>projects.find(project=>project.slug===slug)!);
const featuredDescriptions:Record<string,string>={
  rooftop:'Uma identidade que explora precisão, presença e a linguagem visual da arquitetura.',
  simetria:'Equilíbrio, leveza e uma linguagem visual pensada para transmitir confiança sem parecer distante.',
  'eduardo-noronha':'Uma identidade sóbria e contemporânea para a comunicação jurídica.',
  'amanda-araujo':'Uma linguagem visual que aproxima, acolhe e transmite confiança.',
};
const steps=[
  {title:'Entender',body:'Conhecer o negócio, as pessoas e o contexto. Descobrir o que realmente precisa mudar.'},
  {title:'Definir',body:'Encontrar uma direção e fazer escolhas que tenham motivo para existir. Nem toda tendência serve para toda marca.'},
  {title:'Construir',body:'Transformar essas decisões em uma identidade consistente e verificar como ela funciona nas aplicações.'},
];

export default function Home(){
  const structuredData=[
    {'@context':'https://schema.org','@type':'Person',name:site.name,url:origin,jobTitle:'Diretor de arte',sameAs:socialLinks.map(link=>link.url),homeLocation:{'@type':'Place',name:site.location}},
    {'@context':'https://schema.org','@type':'ProfessionalService',name:site.name,url:origin,description:site.description,email:site.email,areaServed:'Fortaleza, Brasil',sameAs:socialLinks.map(link=>link.url)},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:generalFaq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))},
  ];
  return <main id="conteudo"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/>
  <section className="home-hero"><div className="hero-title"><h1><span className="hero-line"><span>Seu trabalho fala por você.</span></span><span className="hero-line"><span><em>Sua marca também.</em></span></span></h1></div><div className="hero-bottom"><span>Direção de arte.<br/>Identidade visual. Branding.</span><div className="hero-action"><p>Sou Mário Serafim, diretor de arte. Ajudo negócios a construir uma identidade visual que represente melhor o que fazem, com personalidade, clareza e sem fórmulas prontas.</p><Link className="pill hero-cta" href="#contato">Vamos falar da sua marca <Arrow/></Link></div><a className="hero-down" href="#atuacao" aria-label="Conhecer áreas de atuação">↓</a></div></section>

  <section className="section-wrap services-section" id="atuacao"><div className="section-heading" data-reveal><div><span className="eyebrow">O que eu faço</span><h2><span className="editorial-line"><span>Uma boa identidade vai</span></span><span className="editorial-line"><span>muito além do logo.</span></span></h2><p className="home-section-intro">Uma marca aparece em muitos lugares. E precisa fazer sentido em todos eles. Meu trabalho é cuidar para que cada ponto de contato faça parte da mesma história.</p></div><Link className="pill" href="/sobre#processo">Conheça minha abordagem <Arrow/></Link></div><Services/><div className="services-contact"><p>Começando do zero ou sentindo que sua marca já não representa o que você faz?</p><Link className="text-link" href="#contato">Vamos conversar ↗</Link></div></section>

  <section className="selected-section" id="selecionados"><div className="section-heading section-wrap" data-reveal><div><h2>Não existe uma <em>estética</em> que sirva para todo mundo.</h2><p className="home-section-intro">Cada projeto traz um contexto diferente. Aqui estão alguns trabalhos e estudos que mostram como gosto de explorar essas diferenças.</p></div><TrackedLink className="pill" href="/projetos" event="all_projects_click">Ver todos os projetos <Arrow/></TrackedLink></div>
    <div className="home-feature" aria-label="Projeto Amazonita"><Link href="/projetos/amazonita" className="feature-link"><div className="feature-media"><Image src="/media/amazonita-cover.webp" alt="Amazonita: apresentação visual da rocha natural em tons verde-azulados" fill loading="lazy" sizes="90vw"/><div className="feature-overlay"><span>Amazonita / Direção de arte · Digital · Editorial</span><div><span>A matéria-prima como protagonista.</span><Arrow/></div></div></div></Link><p className="home-feature-note">Uma linguagem visual que valoriza a presença e a textura da Amazonita.</p></div>
    <div className="home-projects section-wrap">{featured.map((project,index)=><ProjectCard project={project} key={project.slug} index={index} homeDescription={featuredDescriptions[project.slug]} homeLabel={['rooftop','simetria'].includes(project.slug)?'Identidade visual · Estudo conceitual':undefined}/>)}</div>
  </section>

  <section className="thinking-section section-wrap"><div className="thinking-label"><span className="eyebrow">Como eu trabalho</span><span>Olhar & processo</span></div><ScrollHighlight/><div className="thinking-bottom" data-reveal><div className="home-process-intro"><p>O que sua marca precisa resolver? Quem você quer alcançar? O que já funciona e o que está atrapalhando?</p><p>Gosto de entender essas coisas antes de pensar em cores, fontes ou referências. Não porque exista uma fórmula infalível, mas porque criar sem entender o problema costuma ser um caminho bem mais longo.</p></div><Link href="/sobre#processo" className="pill">Um pouco mais sobre como penso <Arrow/></Link></div><div className="home-process"><p>Meu processo passa por três momentos:</p><ProcessSteps steps={steps}/></div></section>
  <section className="how-section section-wrap" aria-labelledby="how-title"><span className="eyebrow">Como funciona</span><h2 id="how-title">Do primeiro contato<br/>à identidade em uso.</h2><div className="how-grid">
    <article><span>01 / Conversa inicial</span><h3>Entender a necessidade</h3><p>Você me conta o que está acontecendo com a marca. Eu faço perguntas para reconhecer o contexto e o que precisa mudar.</p>{site.processTiming.discovery&&<small>{site.processTiming.discovery}</small>}</article>
    <article><span>02 / Direção</span><h3>Alinhar as escolhas</h3><p>Organizo uma proposta de caminho visual e o escopo do trabalho. As decisões são discutidas antes de avançar.</p>{site.processTiming.direction&&<small>{site.processTiming.direction}</small>}</article>
    <article><span>03 / Construção</span><h3>Desenvolver o sistema</h3><p>A identidade toma forma nas aplicações combinadas. Revisamos como ela funciona e preparamos as entregas previstas.</p>{site.processTiming.delivery&&<small>{site.processTiming.delivery}</small>}</article>
  </div></section>
  <section className="faq-section section-wrap" aria-labelledby="faq-title"><span className="eyebrow">Perguntas frequentes</span><h2 id="faq-title">Antes de começar.</h2><div>{generalFaq.map(item=><details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
</main>}
