import Link from 'next/link';
import Image from 'next/image';
import {ProjectCard} from '@/components/projects';
import {Services} from '@/components/services';
import {ProcessSteps} from '@/components/process-steps';
import {projects} from '@/content/projects';
import {Arrow} from '@/components/shell';
import {Video} from '@/components/case';
import './home.css';

const featured=['simetria','amazonita','eduardo-noronha','amanda-araujo'].map(slug=>projects.find(project=>project.slug===slug)!);
const steps=[
  {title:'Entender',body:'Conhecer o negócio, as pessoas e o contexto. Descobrir o que realmente precisa mudar.'},
  {title:'Definir',body:'Encontrar uma direção e fazer escolhas que tenham motivo para existir. Nem toda tendência serve para toda marca.'},
  {title:'Construir',body:'Transformar essas decisões em uma identidade consistente e verificar como ela funciona nas aplicações.'},
];

export default function Home(){return <main id="conteudo">
  <section className="home-hero"><div className="hero-title"><h1>Seu trabalho fala por você.<br/><em>Sua marca também.</em></h1></div><div className="hero-bottom"><span>Direção de arte.<br/>Identidade visual. Branding.</span><div className="hero-action"><p>Sou Mário Serafim, diretor de arte. Ajudo negócios a construir uma identidade visual que represente melhor o que fazem, com personalidade, clareza e sem fórmulas prontas.</p><Link className="pill hero-cta" href="#contato">Vamos falar da sua marca <Arrow/></Link></div><a className="hero-down" href="#atuacao" aria-label="Conhecer áreas de atuação">↓</a></div></section>

  <section className="section-wrap services-section" id="atuacao"><div className="section-heading" data-reveal><div><span className="eyebrow">O que eu faço</span><h2>Uma boa identidade vai<br/>muito além do logo.</h2><p className="home-section-intro">Uma marca aparece em muitos lugares. E precisa fazer sentido em todos eles. Meu trabalho é cuidar para que cada ponto de contato faça parte da mesma história.</p></div><Link className="pill" href="/sobre#processo">Conheça minha abordagem <Arrow/></Link></div><Services/><div className="services-contact"><p>Começando do zero ou sentindo que sua marca já não representa o que você faz?</p><Link className="text-link" href="#contato">Vamos conversar ↗</Link></div></section>

  <section className="selected-section" id="selecionados"><div className="section-heading section-wrap" data-reveal><div><span className="eyebrow">Trabalhos & estudos</span><h2>Não existe uma estética que<br/>sirva para todo mundo.</h2><p className="home-section-intro">Cada projeto traz um contexto diferente. Aqui estão alguns trabalhos e estudos que mostram como gosto de explorar essas diferenças.</p></div><Link className="pill" href="/projetos">Ver todos os projetos <Arrow/></Link></div>
    <div className="home-feature" aria-label="Projeto Rooftop Arquitetura"><Link href="/projetos/rooftop" className="feature-link"><div className="feature-media"><Image src="/media/rooftop-cover.webp" alt="Rooftop Arquitetura: assinatura visual e apresentação editorial da marca" fill fetchPriority="high" loading="eager" sizes="90vw"/><div className="feature-overlay"><span>Rooftop Arquitetura / Identidade visual · Estudo conceitual</span><div><span>Precisão, presença e arquitetura.</span><Arrow/></div></div></div></Link><p className="home-feature-note">Uma identidade que explora precisão, presença e a linguagem visual da arquitetura.</p></div>
    <div className="showreel section-wrap"><Video src="/media/motion/home-showreel.mp4" poster="/media/motion/home-showreel-poster.webp" caption="Showreel de Amazonita, Rooftop Arquitetura e Simetria Estética"/><div className="showreel-caption"><span>Três projetos. Três linguagens.</span><span>Estudos audiovisuais com Google Flow a partir de materiais reais; Rooftop e Simetria são visualizações conceituais.</span></div></div>
    <div className="home-projects section-wrap">{featured.map((project,index)=><ProjectCard project={project} key={project.slug} index={index} homeDescription={project.slug==='simetria'?'Equilíbrio, leveza e uma linguagem visual pensada para transmitir confiança sem parecer distante.':project.slug==='amazonita'?'Quando o próprio material já tem tanta personalidade, o desafio é encontrar a melhor maneira de apresentá-lo.':project.slug==='eduardo-noronha'?'Uma identidade sóbria e contemporânea, sem os excessos que costumam acompanhar a comunicação jurídica.':'Uma linguagem visual que aproxima, acolhe e transmite confiança.'} homeLabel={project.slug==='simetria'?'Identidade visual · Estudo conceitual':undefined}/>)}</div>
  </section>

  <section className="thinking-section section-wrap"><div className="thinking-label"><span className="eyebrow">Como eu trabalho</span><span>Olhar & processo</span></div><h2 data-reveal>Prefiro fazer boas perguntas<br/><em>antes de abrir um arquivo.</em></h2><div className="thinking-bottom" data-reveal><div className="home-process-intro"><p>O que sua marca precisa resolver? Quem você quer alcançar? O que já funciona e o que está atrapalhando?</p><p>Gosto de entender essas coisas antes de pensar em cores, fontes ou referências. Não porque exista uma fórmula infalível, mas porque criar sem entender o problema costuma ser um caminho bem mais longo.</p></div><Link href="/sobre#processo" className="pill">Um pouco mais sobre como penso <Arrow/></Link></div><div className="home-process"><p>Meu processo passa por três momentos:</p><ProcessSteps steps={steps}/></div></section>
</main>}
