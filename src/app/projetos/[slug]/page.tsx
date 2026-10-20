import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import dimensions from '@/content/media-dimensions.json';
import {projects} from '@/content/projects';
import {CaseRail, CaseViewTracker, Video} from '@/components/case';
import {WhatsAppLink} from '@/components/whatsapp-link';

const origin=(process.env.NEXT_PUBLIC_SITE_URL||'https://mario-serafim-portfolio-2026.mario-92.chatgpt.site').replace(/\/$/,'');
export const dynamicParams=false;
export function generateStaticParams(){return projects.map(project=>({slug:project.slug}))}

type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  const project=projects.find(item=>item.slug===slug);
  if(!project)return {title:'Projeto não encontrado',robots:{index:false}};
  const title=`${project.name} — ${project.discipline}`;
  const description=`${project.headline} Conheça o contexto, as decisões e as aplicações deste projeto de Mário Serafim.`;
  return {title,description,alternates:{canonical:`/projetos/${slug}`},openGraph:{type:'article',title,description,url:`/projetos/${slug}`,images:[{url:project.cover,alt:project.coverAlt}]},twitter:{card:'summary_large_image',title,description,images:[project.cover]}};
}

export default async function Case({params}:Props){
  const {slug}=await params;
  const index=projects.findIndex(project=>project.slug===slug);
  if(index<0)notFound();
  const project=projects[index];
  const previous=projects[(index-1+projects.length)%projects.length];
  const next=projects[(index+1)%projects.length];
  const url=`${origin}/projetos/${slug}`;
  const structuredData=[
    {'@context':'https://schema.org','@type':'CreativeWork',name:project.name,description:project.headline,url,image:`${origin}${project.cover}`,creator:{'@type':'Person',name:'Mário Serafim'},genre:project.discipline},
    {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Início',item:origin},
      {'@type':'ListItem',position:2,name:'Projetos',item:`${origin}/projetos`},
      {'@type':'ListItem',position:3,name:project.name,item:url},
    ]},
  ];
  return <main id="conteudo" className="case-page">
    <CaseViewTracker slug={slug}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/>
    <section className="case-heading section-wrap"><div><Link href="/projetos" className="eyebrow">← Projetos</Link><span className="case-nature">{project.nature}</span></div><div><h1>{project.name}</h1><p>{project.headline}</p></div></section>
    <CaseRail project={project}/>
    <section className="case-story section-wrap" aria-labelledby="case-context-title">
      <dl><div><dt>Atuação</dt><dd>{project.discipline}</dd></div><div><dt>Área</dt><dd>{project.industry}</dd></div><div><dt>Ano do material</dt><dd>{project.year}</dd></div></dl>
      <div><span className="eyebrow">Contexto</span><h2 id="case-context-title">{project.context}</h2><div className="case-facts"><div><h3>Desafio</h3><p>{project.challenge}</p></div><div><h3>Objetivo</h3><p>{project.objective}</p></div><div><h3>Meu papel</h3><p>{project.role}</p></div></div></div>
    </section>
    <section className="case-decisions section-wrap" aria-labelledby="case-decisions-title"><span className="eyebrow">Decisões</span><div><h2 id="case-decisions-title">{project.decisions}</h2><h3>Sistema & aplicações</h3><p>{project.system}</p><div className="palette" aria-label="Paleta do projeto">{project.palette.map(color=><div key={color}><span style={{background:color}}/><span>{color.toUpperCase()}</span></div>)}</div></div></section>
    <section id="galeria" className="case-gallery section-wrap" aria-label={`Sistema e aplicações de ${project.name}`}>{project.gallery.map((media,index)=><figure key={media.src} className={`gallery-${media.layout||'wide'}`} data-reveal>{media.kind==='video'?<Video src={media.src} caption={media.alt} poster={media.poster}/>:<div className={`gallery-image ${media.contain?'contain':''}`}><Image src={media.src} alt={media.alt} width={(dimensions as Record<string,{width:number;height:number}>)[media.src].width} height={(dimensions as Record<string,{width:number;height:number}>)[media.src].height} sizes={media.layout==='half'?'(max-width: 700px) 90vw, 45vw':'90vw'} style={{height:'auto',width:'100%'}} loading="lazy"/></div>}<figcaption><span>{media.caption.replace(/^\d{2} — /,'')}</span><span>{String(index+1).padStart(2,'0')} / {String(project.gallery.length).padStart(2,'0')}</span></figcaption></figure>)}</section>
    <section className="case-result section-wrap"><span className="eyebrow">Resultado</span><p>{project.result}</p></section>
    {project.testimonial&&<section className="case-testimonial section-wrap"><span className="eyebrow">Depoimento</span><blockquote><p>{project.testimonial.quote}</p><cite>{project.testimonial.author}</cite></blockquote></section>}
    <section className="case-credits section-wrap"><span className="eyebrow">Créditos</span><p>{project.credits}</p></section>
    <section className="case-contact section-wrap"><span className="eyebrow">Tem uma ideia em mente?</span><h2>Vamos conversar sobre o seu projeto.</h2><div><Link className="pill filled" href="/contato">Entrar em contato ↗</Link><WhatsAppLink context={`o projeto ${project.name}`} className="text-link"/></div></section>
    <nav className="case-navigation section-wrap" aria-label="Navegar entre projetos"><Link href={`/projetos/${previous.slug}`}><span className="eyebrow">← Projeto anterior</span><strong>{previous.name}</strong></Link><Link href={`/projetos/${next.slug}`}><span className="eyebrow">Próximo projeto →</span><strong>{next.name}</strong></Link></nav>
  </main>;
}
