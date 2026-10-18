import Link from 'next/link';
import Image from 'next/image';
import {ProjectCard} from '@/components/projects';
import {Services} from '@/components/services';
import {projects} from '@/content/projects';
import {Arrow} from '@/components/shell';
export default function Home(){return <main id="conteudo">
 <section className="home-hero"><div className="hero-title"><h1>O valor começa <br/>na <em>percepção.</em></h1></div><div className="hero-bottom"><span>Direção de arte.<br/>Identidade. Experiência.</span><p>Sou Mário Serafim. Conecto estratégia e expressão visual para dar às marcas uma presença própria.</p><a className="hero-down" href="#selecionados" aria-label="Explorar projetos selecionados">↓</a></div></section>
 <section className="home-feature" aria-label="Projeto em destaque"><Link href="/projetos/amazonita" className="feature-link"><div className="feature-media"><Image src="/media/amazonita-cover.webp" alt="Amazonita: direção de arte para uma presença digital inspirada na matéria-prima" fill fetchPriority="high" loading="eager" sizes="90vw"/><div className="feature-overlay"><span>Em foco / 01</span><div><span>Amazonita</span><Arrow/></div></div></div></Link></section>
 <section className="section-wrap services-section" id="atuacao"><div className="section-heading" data-reveal><div><span className="eyebrow">Áreas de atuação</span><h2>Do que a marca é.<br/>Ao que ela faz sentir.</h2></div><Link className="pill" href="/sobre#processo">Conheça a abordagem <Arrow/></Link></div><Services/></section>
 <section className="selected-section" id="selecionados"><div className="section-heading section-wrap" data-reveal><div><span className="eyebrow">Projetos selecionados</span><h2>Ideias que encontram<br/>a sua expressão.</h2></div><Link className="pill" href="/projetos">Todos os projetos <Arrow/></Link></div><div className="home-projects section-wrap">{projects.map((p,i)=><ProjectCard project={p} key={p.slug} index={i}/>)}</div></section>
 <section className="thinking-section section-wrap"><div className="thinking-label"><span className="eyebrow">Olhar & processo</span><span>Notas sobre design / 01</span></div><h2 data-reveal>Antes de desenhar,<br/><em>aprender a olhar.</em></h2><div className="thinking-bottom" data-reveal><p>Uma marca ganha sentido quando as escolhas se conectam. O contexto orienta a ideia. A ideia orienta a forma. E cada detalhe precisa saber por que está ali.</p><Link href="/sobre#processo" className="pill">Meu modo de pensar <Arrow/></Link></div><div className="thinking-words" aria-hidden="true"><span>Contexto</span><span>Intenção</span><span>Expressão</span></div></section>
 </main>}


