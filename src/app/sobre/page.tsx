import type { Metadata } from 'next';
import Link from 'next/link';
import {AboutTypewriter} from '@/components/about-typewriter';
import {PointerProse} from '@/components/pointer-prose';
import './about.css';
import Image from 'next/image';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {site} from '@/content/site';
import {socialLinks} from '@/lib/site-links';

export const metadata: Metadata = {
  title: 'Sobre Mário Serafim | Diretor de Arte e Designer',
  description: 'Conheça Mário Serafim, diretor de arte em Fortaleza. Seu caminho pelo marketing, design e tecnologia e sua maneira de trabalhar.',
  alternates:{canonical:'/sobre'},
  openGraph:{title:'Sobre Mário Serafim — Direção de arte em Fortaleza',description:'Minha trajetória, formação e maneira de trabalhar com direção de arte e identidade visual.',url:'/sobre'},
};

// Certificação Adobe: reservar a inclusão até confirmar título oficial e validade.
const highlights = [
  {label: 'Direção de Arte', body: 'Pós-graduação pela Anhanguera. Uma formação que acompanha minha atuação profissional.'},
  {label: 'Marketing', body: 'Graduação pela Wyden/Fanor. Foi onde minha formação profissional começou.'},
  {label: 'UX, UI e Desenvolvimento Web', body: 'Estudos em experiência do usuário, interfaces digitais e programação. Conhecimentos que ajudam a aproximar a criação visual do uso real.'},
];

const processParagraphs=[
  'Antes de pensar em cores, fontes ou referências, gosto de entender o problema. Quem é a marca? Com quem ela quer conversar? O que precisa mudar? O que já funciona?',
  'Pode parecer óbvio, mas nem sempre essas perguntas recebem a atenção que merecem.',
  'Também fui estudar UX e desenvolvimento web. Não para abandonar a direção de arte, mas para entender melhor o que acontece depois que uma ideia sai da apresentação e precisa funcionar de verdade.',
  'Gosto de experimentar, testar possibilidades e questionar minhas próprias escolhas. Nem sempre a primeira solução é a melhor. E tudo bem.',
];

export default function About() {
  const photoExists=existsSync(join(process.cwd(),'public',site.authorPhoto.replace(/^\//,'')));
  const origin=(process.env.NEXT_PUBLIC_SITE_URL||'https://marioserafim.com.br').replace(/\/$/,'');
  const structuredData={'@context':'https://schema.org','@type':'Person',name:site.name,url:origin,jobTitle:'Diretor de arte',sameAs:socialLinks.map(link=>link.url)};
  return <main id="conteudo" className="editorial-about">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/>
    <section className="about-opening section-wrap" aria-labelledby="about-title">
      <div className="about-opening-top"><span className="eyebrow">Sobre Mário Serafim</span><span>Direção de arte · Fortaleza, CE</span></div>
      <h1 id="about-title">Gosto de entender<br/>antes de <em>desenhar.</em></h1>
      <div className="about-opening-bottom"><span aria-hidden="true">↘</span><AboutTypewriter /></div>
    </section>

    <section className="about-origin section-wrap" aria-labelledby="origin-title">
      <span className="eyebrow">01 / Um pouco sobre mim</span>
      <div><h2 id="origin-title">Meu caminho<br/><em>até aqui.</em></h2>
        {photoExists&&<figure className="about-portrait"><Image src={site.authorPhoto} alt="Retrato de Mário Serafim" width={640} height={800} sizes="(max-width: 700px) 90vw, 420px"/></figure>}
        <div className="about-prose"><p>Comecei pelo marketing e, aos poucos, fui me aproximando cada vez mais do design. Passei por agências, trabalhei com educação, esporte e hoje estou no setor de rochas naturais. São universos bem diferentes, e talvez seja justamente isso que mais tenha acrescentado à minha maneira de trabalhar.</p><p>Aprendi que nem toda marca precisa parecer moderna, minimalista ou seguir a tendência do momento. Às vezes, a melhor decisão é fazer exatamente o contrário.</p><p>Hoje me interessa menos encontrar uma estética bonita logo de cara e mais descobrir qual direção realmente combina com o projeto.</p></div>
      </div>
    </section>

    <section className="about-thinking section-wrap" id="processo" aria-labelledby="thinking-title">
      <div className="about-thinking-head"><span className="eyebrow">02 / Como eu trabalho</span></div>
      <div className="about-thinking-body"><h2 id="thinking-title">Não começo pelo <em>Photoshop.</em></h2><PointerProse paragraphs={processParagraphs}/></div>
    </section>

    <section className="about-credentials section-wrap" aria-labelledby="credentials-title">
      <div className="about-credentials-head"><span className="eyebrow">Algumas coisas pelo caminho</span><div><h2 id="credentials-title">Nem tudo precisa virar<br/>uma linha do tempo.</h2><p>Minha trajetória passou por áreas diferentes. Estes são alguns dos estudos e experiências que considero relevantes para o trabalho que faço hoje.</p></div></div>
      <div className="about-credential-list">{highlights.map((item, index) => <article key={item.label}><span>{String(index+1).padStart(2,'0')} /</span><div><h3><span className="credential-title-base">{item.label}</span><span className="credential-title-italic" aria-hidden="true">{item.label}</span></h3><p>{item.body}</p></div></article>)}</div>
    </section>

    <section className="about-ending section-wrap" aria-labelledby="ending-title"><span className="eyebrow">O trabalho continua</span><div><h2 id="ending-title">O restante está<br/><em>nos projetos.</em></h2><p>Falei um pouco sobre mim. Mas acho que a melhor maneira de entender meu trabalho é conhecer os projetos, as escolhas que fiz e os problemas que tentei resolver.</p><div className="about-ending-actions"><Link className="pill filled" href="/projetos">Ver meus projetos <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/contato">Entrar em contato ↗</Link></div></div></section>
  </main>;
}
