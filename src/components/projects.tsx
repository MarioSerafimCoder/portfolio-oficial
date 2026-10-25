'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { projects } from '@/content/projects';
import { Arrow } from './shell';
import {ProjectCard} from './project-card';
export {ProjectCard} from './project-card';

export function ProjectBrowser(){
 const [mode,setMode]=useState<'gallery'|'index'>('gallery');
 const [filter,setFilter]=useState('Todos');
 const categories=['Todos','Arquitetura','Saúde e bem-estar','Serviços profissionais','Indústria e materiais'];
 const categoryFor=(industry:string)=>industry==='Arquitetura'?'Arquitetura':industry==='Estética e bem-estar'?'Saúde e bem-estar':industry==='Rochas naturais'?'Indústria e materiais':'Serviços profissionais';
 const selected=projects.filter(p=>filter==='Todos'||categoryFor(p.industry)===filter);
 return <><div className="project-controls"><div className="project-filters" role="group" aria-label="Filtrar projetos">{categories.map(c=><button key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{c}</button>)}</div><div className="view-switch" role="group" aria-label="Visualização dos projetos"><button aria-pressed={mode==='gallery'} onClick={()=>setMode('gallery')}>Galeria</button><button aria-pressed={mode==='index'} onClick={()=>setMode('index')}>Índice</button></div></div><p className="sr-only" role="status">{selected.length} projetos encontrados</p>{mode==='gallery'?<div className="project-gallery" key={filter}>{selected.map((p,i)=><ProjectCard project={p} key={p.slug} index={i}/>)}</div>:<div className="project-index">{selected.map((p,i)=><Link key={p.slug} href={`/projetos/${p.slug}`}><span className="index-number">0{i+1}</span><h2>{p.name}</h2><span>{p.discipline}</span><span>{p.year}</span><Arrow/></Link>)}</div>}</>;
}

