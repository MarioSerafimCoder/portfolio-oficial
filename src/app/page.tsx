import Link from 'next/link';
import {Services} from '@/components/services';
import {ProcessSteps} from '@/components/process-steps';
import {Arrow} from '@/components/shell';
import './home.css';
import type {Metadata} from 'next';
import {site,generalFaq} from '@/content/site';
import {socialLinks} from '@/lib/site-links';
import {TrackedLink} from '@/components/tracked-link';
import {PerceptionHero} from '@/components/perception-hero';
import {EditorialProjects} from '@/components/editorial-projects';
import {ScrollHighlight} from '@/components/scroll-highlight';

const origin=(process.env.NEXT_PUBLIC_SITE_URL||'https://marioserafim.com.br').replace(/\/$/,'');
export const metadata:Metadata={title:'Direção de arte, identidade visual e branding em Fortaleza',description:'Portfólio de Mário Serafim: direção de arte, identidade visual, branding e experiências digitais desenvolvidas com clareza e personalidade.',alternates:{canonical:'/'},openGraph:{title:'Mário Serafim — Direção de arte e identidade visual',description:site.description,url:'/'}};

const steps=[
  {title:'Entender',body:'Você me conta o que está acontecendo com a marca. Eu faço perguntas para entender o negócio, as pessoas e o que precisa mudar.'},
  {title:'Definir',body:'Alinhamos a direção visual e o escopo. As escolhas são discutidas antes de avançar, com motivos que façam sentido para a marca.'},
  {title:'Construir',body:'A identidade toma forma nas aplicações combinadas. Revisamos como ela funciona e preparamos as entregas previstas.'},
];

export default function Home(){
  const structuredData=[
    {'@context':'https://schema.org','@type':'Person',name:site.name,url:origin,jobTitle:'Diretor de arte',sameAs:socialLinks.map(link=>link.url),homeLocation:{'@type':'Place',name:site.location}},
    {'@context':'https://schema.org','@type':'ProfessionalService',name:site.name,url:origin,description:site.description,email:site.email,areaServed:'Fortaleza, Brasil',sameAs:socialLinks.map(link=>link.url)},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:generalFaq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))},
  ];
  return <main id="conteudo"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/>
  <PerceptionHero><div className="perception-heading"><span className="perception-label">Mário Serafim / Direção de arte & identidade visual</span><h1 id="perception-title"><span className="perception-line"><span data-perception-line>Identidade</span></span> <span className="perception-line"><span data-perception-line>é <em>percepção.</em></span></span></h1></div><div className="perception-support"><span>Direção de arte.<br/>Identidade visual. Branding.</span><div><p>Sou Mário Serafim, diretor de arte. Ajudo negócios a construir uma identidade visual que represente melhor o que fazem, com personalidade, clareza e sem fórmulas prontas.</p><a className="pill" href="#contato">Vamos falar da sua marca <Arrow/></a></div><a className="hero-down" href="#selecionados" aria-label="Ver projetos selecionados">↓</a></div></PerceptionHero>

  <section className="selected-section" id="selecionados"><div className="section-heading section-wrap" data-reveal><div><h2>Não existe uma <em>estética</em> que sirva para todo mundo.</h2><p className="home-section-intro">Cada projeto traz um contexto diferente. Aqui estão alguns trabalhos e estudos que mostram como gosto de explorar essas diferenças.</p></div><TrackedLink className="pill" href="/projetos" event="all_projects_click">Ver todos os projetos <Arrow/></TrackedLink></div>
    <EditorialProjects/>
  </section>

  <section className="section-wrap services-section" id="atuacao"><div className="section-heading" data-reveal><div><span className="eyebrow">O que eu faço</span><h2><span className="editorial-line"><span>Uma boa identidade vai</span></span><span className="editorial-line"><span>muito além do logo.</span></span></h2><p className="home-section-intro">Uma marca aparece em muitos lugares. E precisa fazer sentido em todos eles. Meu trabalho é cuidar para que cada ponto de contato faça parte da mesma história.</p></div><Link className="pill" href="/sobre#processo">Conheça minha abordagem <Arrow/></Link></div><Services/><div className="services-contact"><p>Começando do zero ou sentindo que sua marca já não representa o que você faz?</p><a className="text-link" href="#contato">Vamos conversar ↗</a></div></section>

  <section className="thinking-section section-wrap"><div className="thinking-label"><span className="eyebrow">Como eu trabalho</span><span>Olhar & processo</span></div><ScrollHighlight/><div className="thinking-bottom" data-reveal><div className="home-process-intro"><p>O que sua marca precisa resolver? Quem você quer alcançar? O que já funciona e o que está atrapalhando?</p><p>Gosto de entender essas coisas antes de pensar em cores, fontes ou referências. Não porque exista uma fórmula infalível, mas porque criar sem entender o problema costuma ser um caminho bem mais longo.</p></div><Link href="/sobre#processo" className="pill">Um pouco mais sobre como penso <Arrow/></Link></div><div className="home-process"><p>Meu processo passa por três momentos:</p><ProcessSteps steps={steps}/></div></section>
  <section className="faq-section section-wrap" aria-labelledby="faq-title"><span className="eyebrow">Perguntas frequentes</span><h2 id="faq-title">Antes de começar.</h2><div>{generalFaq.map(item=><details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
</main>}
