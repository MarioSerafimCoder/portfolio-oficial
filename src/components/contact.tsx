'use client';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import {briefingText, mailtoDraft, emlDraft} from '@/lib/contact.mjs';
export function ContactForm(){
 const [step,setStep]=useState(1);
 const [data,setData]=useState({name:'',email:'',type:'',description:''});
 const [feedback,setFeedback]=useState('');
 const title=useRef<HTMLHeadingElement>(null);
 const [dirty,setDirty]=useState(false);
 useEffect(()=>{if(dirty)title.current?.focus()},[step,dirty]);
 const change=(key:keyof typeof data,value:string)=>setData(d=>({...d,[key]:value}));
 function next(e:React.FormEvent){e.preventDefault();setDirty(true);setStep(s=>s+1);setFeedback('')}
 async function copy(){try{await navigator.clipboard.writeText(briefingText(data));setFeedback('Briefing copiado. Você pode colar na sua mensagem.')}catch{setFeedback('Não foi possível copiar. Selecione o texto do briefing abaixo ou baixe o rascunho.')}}
 function download(){const blob=new Blob([emlDraft(data,site.email)],{type:'message/rfc822'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='projeto-para-mario.eml';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setFeedback('Rascunho preparado. Abra no seu aplicativo de e-mail e envie quando estiver pronto.')}
 return <div className="contact-form"><div className="form-progress" aria-label={`Etapa ${step} de 3`}><span>Começar uma conversa</span><span>0{step} / 03</span><div className="progress-track"><span style={{width:`${step/3*100}%`}}/></div></div><h2 ref={title} tabIndex={-1}>{step===1?'Primeiro, como posso chamar você?':step===2?'O que você tem em mente?':'Uma boa conversa começa aqui.'}</h2>
 {step===1&&<form onSubmit={next}><label htmlFor="contact-name">Seu nome<input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={data.name} onChange={e=>change('name',e.target.value)} placeholder="Como você se chama?"/></label><label htmlFor="contact-email">Seu e-mail<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={180} value={data.email} onChange={e=>change('email',e.target.value)} placeholder="voce@empresa.com.br"/></label><button className="pill filled" type="submit">Continuar <span aria-hidden="true">→</span></button><p className="form-note">Seus dados ficam apenas nesta página até você preparar e enviar o e-mail.</p></form>}
 {step===2&&<form onSubmit={next}><label htmlFor="project-type">Tipo de projeto<select id="project-type" value={data.type} required onChange={e=>change('type',e.target.value)}><option value="" disabled>Selecione uma possibilidade</option>{['Identidade visual','Branding','Direção de arte','Experiência digital','Quero entender as possibilidades'].map(s=><option key={s}>{s}</option>)}</select></label><label htmlFor="project-description">Conte um pouco sobre a ideia<textarea id="project-description" value={data.description} required minLength={20} maxLength={1200} rows={4} onChange={e=>change('description',e.target.value)} placeholder="O que você quer construir ou transformar?"/><span className="field-hint">De 20 a 1.200 caracteres. {data.description.length}/1200</span></label><div className="form-buttons"><button type="button" className="text-button" onClick={()=>setStep(1)}>← Voltar</button><button type="submit" className="pill filled">Revisar mensagem →</button></div></form>}
 {step===3&&<div className="draft-review"><pre>{briefingText(data)}</pre><a className="pill filled" href={mailtoDraft(data,site.email)}>Abrir no meu e-mail ↗</a><p className="form-note">O aplicativo de e-mail será aberto com a mensagem pronta. O envio acontece por lá. Se não abrir, baixe o rascunho ou copie o briefing e envie para <a href={`mailto:${site.email}`}>{site.email}</a>.</p><div className="draft-actions"><button className="text-button" onClick={()=>setStep(2)}>← Editar</button><button className="text-button" onClick={copy}>Copiar briefing</button><button className="text-button" onClick={download}>Baixar rascunho .eml ↓</button></div></div>}
 <p role="status" className="form-status">{feedback}</p></div>;
}
