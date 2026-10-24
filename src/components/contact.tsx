'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import { site } from '@/content/site';
import { briefingText, deliveryPayload, mailtoDraft, emlDraft } from '@/lib/contact.mjs';
import {trackEvent} from '@/lib/analytics';

const options = ['Identidade visual','Branding','Direção de arte','Site ou experiência digital','Ainda não tenho certeza'];
const industries = ['Arquitetura e construção','Saúde e bem-estar','Serviços profissionais','Comércio e varejo','Educação','Indústria','Outra'];
const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || 'https://script.google.com/macros/s/AKfycbyulPLIGLCQKtFhvcvRvz69KwrZIc4S_2TcQNU-4rWDanoisOmVMlyoATYTnHx3pToU/exec';
// A collector may subscribe to this event. No visitor fields leave through analytics.
function track(name:string){window.dispatchEvent(new CustomEvent('portfolio:analytics',{detail:{event:name,form:'contact'}}));}
export function ContactForm(){
 const isHome=usePathname()==="/";
 const id=useId().replace(/:/g,'');
 const [step,setStep]=useState(1);
 const [data,setData]=useState({name:'',email:'',type:'',industry:'',budget:'',whatsapp:'',description:'',website:''});
 const [feedback,setFeedback]=useState('');
 const [sending,setSending]=useState(false);
 const [sent,setSent]=useState(false);
 const [errors,setErrors]=useState<Record<string,string>>({});
 const touched=useRef(new Set<string>());
 const root=useRef<HTMLDivElement>(null);
 const title=useRef<HTMLHeadingElement>(null);
 const frame=useRef<HTMLIFrameElement>(null);
 const deliveryForm=useRef<HTMLFormElement>(null);
 const activeToken=useRef('');
 const inFlight=useRef(false);
 const previous=useRef<{key:string;payload:ReturnType<typeof deliveryPayload>}|null>(null);
 const started=useRef(false);
 const moveFocus=useRef(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{if(moveFocus.current)title.current?.focus()},[step,sent]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){track('contact_form_view');observer.disconnect()}},{threshold:.2});if(root.current)observer.observe(root.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{
  function receive(event:MessageEvent){
   let trusted=false;try{const host=new URL(event.origin).hostname;trusted=host==='script.google.com'||host.endsWith('.googleusercontent.com')}catch{}
   const message=event.data;
   if(!trusted||!activeToken.current||message?.source!=='mario-portfolio-contact'||message.token!==activeToken.current)return;
   if(timer.current)clearTimeout(timer.current);
   activeToken.current='';inFlight.current=false;setSending(false);
   if(message.status==='sent'){moveFocus.current=true;setSent(true);setFeedback('');track('contact_form_success')}
   else {setFeedback(message.message||'Não foi possível enviar. Seus dados foram preservados. Tente novamente ou use o e-mail abaixo.');track('contact_form_error')}
  }
  window.addEventListener('message',receive);
  return()=>{window.removeEventListener('message',receive);if(timer.current)clearTimeout(timer.current)};
 },[]);
 function fieldError(key:string,value:string){
  if(key==='name'&&value.trim().length<2)return 'Informe seu nome com pelo menos 2 caracteres.';
  if(key==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))return 'Informe um e-mail válido, como voce@empresa.com.br.';
  if(key==='whatsapp'&&value.trim()&&value.replace(/\D/g,'').length<10)return 'Informe um telefone com DDD ou deixe este campo vazio.';
  return '';
 }
 function validate(key:keyof typeof data){touched.current.add(key);setErrors(e=>({...e,[key]:fieldError(key,data[key])}))}
 function change(key:keyof typeof data,value:string){if(!started.current&&key!=='website'){started.current=true;trackEvent('contact_form_start')}setData(d=>({...d,[key]:value}));setErrors(e=>({...e,[key]:touched.current.has(key)?fieldError(key,value):''}));}
 function next(e:React.FormEvent){e.preventDefault();if(!data.type){setErrors({type:'Escolha a opção que mais se aproxima da sua ideia.'});document.getElementById(`${id}-type-0`)?.focus();return}moveFocus.current=true;setStep(2);setFeedback('');track('contact_step_1_complete');track('contact_step_2_view')}
 function send(e:React.FormEvent){
  e.preventDefault();if(inFlight.current||sent)return;
  const invalid:Record<string,string>={};
  if(data.website.trim())return;
  for(const key of ['name','email','whatsapp'] as const){touched.current.add(key);const error=fieldError(key,data[key]);if(error)invalid[key]=error}
  setErrors(invalid);if(Object.keys(invalid).length){document.getElementById(`${id}-${Object.keys(invalid)[0]}`)?.focus();return}
  if(!deliveryForm.current)return;
  const form=deliveryForm.current;const token=crypto.randomUUID();activeToken.current=token;
  const key=JSON.stringify(data);
  if(previous.current?.key!==key)previous.current={key,payload:deliveryPayload(data,window.location.origin+window.location.pathname+'#contato')};
  const payload={...previous.current!.payload,token};
  for(const [key,value] of Object.entries(payload)){const input=form.elements.namedItem(key) as HTMLInputElement;input.value=String(value)}
  inFlight.current=true;setSending(true);setFeedback('Enviando sua solicitação…');trackEvent('contact_form_submit',{area:data.industry||'não informada'});
  try{form.submit();timer.current=setTimeout(()=>{inFlight.current=false;setSending(false);setFeedback('A confirmação está demorando. Seus dados continuam aqui. Você pode aguardar, tentar novamente ou usar o e-mail direto.');track('contact_form_error')},25000)}catch{inFlight.current=false;activeToken.current='';setSending(false);setFeedback('Não foi possível enviar. Seus dados foram preservados. Use o e-mail abaixo ou tente novamente.');track('contact_form_error')}
 }
 async function copy(){try{await navigator.clipboard.writeText(briefingText(data));setFeedback('Briefing copiado. Cole na sua mensagem.')}catch{setFeedback('Não foi possível copiar. Use o e-mail direto ou baixe o rascunho.')}}
 function download(){const url=URL.createObjectURL(new Blob([emlDraft(data,site.email)],{type:'message/rfc822'}));const a=document.createElement('a');a.href=url;a.download='projeto-para-mario.eml';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setFeedback('Rascunho preparado para abrir e enviar no seu aplicativo de e-mail.')}
 return <div ref={root} className="contact-form" aria-busy={sending}>
  <div className="form-progress" aria-label={`Etapa ${step} de 2`}><span>Vamos começar</span><span>0{step} / 02</span><div className="progress-track"><span style={{transform:`scaleX(${step/2})`}}/></div></div>
  <h2 ref={title} tabIndex={-1}>{sent?'Sua mensagem chegou.':step===1?(isHome?'O que você precisa hoje?':'O que você tem em mente?'):'Agora, vamos nos conhecer.'}</h2>
  {sent?<div className="contact-success"><span aria-hidden="true">↗</span><p>Obrigado por compartilhar seu projeto. {site.responseBusinessDays?`Respondo em até ${site.responseBusinessDays} dias úteis.`:'Vou responder assim que puder.'}</p><Link className="text-link" href="/projetos">Explorar projetos ↗</Link></div>:step===1?<form key="project" onSubmit={next} noValidate>
   <fieldset className="project-options" aria-describedby={errors.type?`${id}-type-error`:undefined}><legend className="sr-only">Escolha o tipo de projeto</legend>{options.map((option,i)=><label className="project-option" key={option}><input id={`${id}-type-${i}`} type="radio" name={`${id}-type`} value={option} checked={data.type===option} onChange={()=>change('type',option)}/><span>{option}<span className="option-mark" aria-hidden="true">{data.type===option?'↗':'+'}</span></span></label>)}</fieldset>
   {errors.type&&<p className="field-error" id={`${id}-type-error`} role="alert">{errors.type}</p>}
   <label htmlFor={`${id}-industry`}>Área de atuação do seu negócio <span className="optional">opcional</span><select id={`${id}-industry`} value={data.industry} onChange={e=>change('industry',e.target.value)}><option value="">Selecione, se fizer sentido</option>{industries.map(industry=><option key={industry}>{industry}</option>)}</select></label>
   <label htmlFor={`${id}-budget`}>Faixa de investimento prevista <span className="optional">opcional</span><select id={`${id}-budget`} value={data.budget} onChange={e=>change('budget',e.target.value)}><option value="">Selecione, se já tiver uma ideia</option>{site.investmentRanges.map(b=><option key={b}>{b}</option>)}</select></label>
   <div className="form-buttons"><span className="form-reassurance">Não sabe responder tudo ainda? Sem problema. Podemos conversar sobre isso.</span><button type="submit" className="pill filled">Continuar <span aria-hidden="true">→</span></button></div>
   <p className="form-note">Se já tiver uma ideia de investimento, pode indicar. Isso ajuda a entender o escopo, mas não é um compromisso de orçamento.</p>
  </form>:<form key="details" onSubmit={send} noValidate>
   <p className="step-intro">Como posso entrar em contato para entender melhor sua ideia?</p>
   <label className="contact-honeypot" htmlFor={`${id}-website`} aria-hidden="true">Deixe este campo vazio<input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={e=>change('website',e.target.value)}/></label>
   <div className="contact-fields">{(['name','email','whatsapp'] as const).map(key=><label key={key} htmlFor={`${id}-${key}`}>{key==='name'?'Nome':key==='email'?'E-mail':'WhatsApp'} {key==='whatsapp'&&<span className="optional">opcional</span>}<input id={`${id}-${key}`} name={key} aria-label={key==='name'?'Nome':key==='email'?'E-mail':'WhatsApp opcional'} type={key==='email'?'email':key==='whatsapp'?'tel':'text'} autoComplete={key==='whatsapp'?'tel':key} disabled={sending} required={key!=='whatsapp'} maxLength={key==='email'?180:key==='whatsapp'?40:100} value={data[key]} onChange={e=>change(key,e.target.value)} onBlur={()=>validate(key)} aria-invalid={!!errors[key]} aria-describedby={errors[key]?`${id}-${key}-error`:undefined}/>{errors[key]&&<span id={`${id}-${key}-error`} className="field-error" role="alert">{errors[key]}</span>}</label>)}</div>
   <label htmlFor={`${id}-description`}>Breve descrição do projeto <span className="optional">opcional</span><textarea disabled={sending} id={`${id}-description`} maxLength={750} rows={3} value={data.description} onChange={e=>change('description',e.target.value)}/></label>
   <div className="form-buttons"><button className="text-button" type="button" disabled={sending} onClick={()=>{moveFocus.current=true;setStep(1);setFeedback('')}}>← Voltar</button><button className="pill filled" type="submit" disabled={sending}>{sending?'Enviando…':'Enviar solicitação ↗'}</button></div>
   <p className="form-note">Usarei seus dados apenas para responder e conversar sobre o projeto. <Link href="/privacidade">Privacidade</Link>.</p>
   {feedback&&<div className="draft-actions"><a className="text-link" href={mailtoDraft(data,site.email)}>Usar meu e-mail ↗</a><button type="button" className="text-button" onClick={copy}>Copiar briefing</button><button type="button" className="text-button" onClick={download}>Baixar rascunho</button></div>}
  </form>}
  <p role="status" className={`form-status ${sent?'success':''}`}>{feedback}</p>
  <iframe ref={frame} name={`${id}-delivery`} title="Confirmação do envio" className="delivery-frame" tabIndex={-1} aria-hidden="true"/>
  <form ref={deliveryForm} action={endpoint} method="post" target={`${id}-delivery`} hidden aria-hidden="true">{['token','name','email','type','description','website'].map(key=><input key={key} type="hidden" name={key} defaultValue=""/>)}</form>
 </div>;
}
