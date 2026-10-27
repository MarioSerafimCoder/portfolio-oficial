'use client';
import Image from 'next/image';
import {useState} from 'react';
import {services} from '@/content/site';
import {QuietDisclosures} from './quiet-disclosures';

const previews=[
 {src:'/media/rooftop-home.webp',alt:'Assinatura real da Rooftop Arquitetura',caption:'Rooftop / Identidade visual'},
 {src:null,alt:'',caption:'Fundamentos antes da expressão'},
 {src:'/media/amazonita-cover.webp',alt:'Direção de arte Amazonita',caption:'Amazonita / Direção de arte'},
 {src:'/media/amazonita-web.webp',alt:'Interface da experiência digital Amazonita',caption:'Amazonita / Experiência digital'},
];
function Preview({index}:{index:number}){const preview=previews[index];return preview.src?<Image src={preview.src} alt={preview.alt} fill sizes="(max-width:700px) 86vw, 34vw"/>:<div className="brand-foundations"><span>01 / Contexto</span><strong>O que<br/>move<br/><em>a marca?</em></strong><span>02 / Direção<br/>03 / Expressão</span><svg viewBox="0 0 300 300" aria-hidden="true"><ellipse cx="150" cy="150" rx="128" ry="80" transform="rotate(-30 150 150)"/></svg></div>}
export function Services(){
 const [active,setActive]=useState(0);
 return <div className="service-workbench" data-motion-owner="services"><div className="service-list"><QuietDisclosures>{services.map((s,i)=><details key={s.title} className="service-row" onToggle={event=>{if(event.currentTarget.open)setActive(i)}}><summary><span className="service-number">0{i+1}</span><h3>{s.title}</h3><span className="service-plus" aria-hidden="true">+</span></summary><p className="service-line">{s.line}</p><div className="service-description"><p>{s.text}</p><span><strong>Possíveis entregas</strong> {s.scope}</span></div><div className="service-inline-preview"><div className="service-preview-stage"><Preview index={i}/></div><p className="service-preview-caption">{previews[i].caption}</p></div></details>)}</QuietDisclosures></div><aside className="service-preview" aria-label="Prévia visual do serviço selecionado"><div className="service-preview-stage">{previews.map((preview,i)=><figure key={i} data-active={active===i} aria-hidden={active!==i}><Preview index={i}/></figure>)}</div><p className="service-preview-caption" aria-live="polite">{previews[active].caption}</p></aside></div>;
}
