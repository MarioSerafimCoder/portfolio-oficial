'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { projects, Project } from '@/content/projects';
import { Arrow } from './shell';

export function ProjectCard({project,index=0,priority=false,homeDescription,homeLabel}:{project:Project;index?:number;priority?:boolean;homeDescription?:string;homeLabel?:string}){return <Link href={`/projetos/${project.slug}`} className={`project-card project-${index%4} card-${project.slug}`} data-reveal><div className="project-media" style={{background:project.palette[0]}}><Image src={project.cardCover||project.cover} alt={project.coverAlt} fill sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 45vw" priority={priority}/><span className="project-visit" aria-hidden="true">Ver projeto ↗</span></div><div className="project-caption"><div><h2>{project.name}</h2><p>{homeLabel||project.discipline}</p><p className="project-teaser">{homeDescription||project.headline}</p></div><Arrow/></div></Link>}

export function ProjectBrowser(){
 const [mode,setMode]=useState<'gallery'|'index'>('gallery');
 const [filter,setFilter]=useState('Todos');
 const categories=['Todos','Identidade visual','Digital','Editorial'];
 const order=['rooftop','simetria','amazonita','eduardo-noronha','amanda-araujo'];
 const selected=projects.filter(p=>filter==='Todos'||p.discipline.toLowerCase().includes(filter.toLowerCase())).sort((a,b)=>order.indexOf(a.slug)-order.indexOf(b.slug));
 return <><div className="project-controls"><div className="project-filters" role="group" aria-label="Filtrar projetos">{categories.map(c=><button key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{c}</button>)}</div><div className="view-switch" role="group" aria-label="Visualização dos projetos"><button aria-pressed={mode==='gallery'} onClick={()=>setMode('gallery')}>Galeria</button><button aria-pressed={mode==='index'} onClick={()=>setMode('index')}>Índice</button></div></div><p className="sr-only" role="status">{selected.length} projetos encontrados</p>{mode==='gallery'?<div className="project-gallery" key={filter}>{selected.map((p,i)=><ProjectCard project={p} key={p.slug} index={i}/>)}</div>:<div className="project-index">{selected.map((p,i)=><Link key={p.slug} href={`/projetos/${p.slug}`}><span className="index-number">0{i+1}</span><h2>{p.name}</h2><span>{p.discipline}</span><span>{p.year}</span><Arrow/></Link>)}</div>}</>;
}

