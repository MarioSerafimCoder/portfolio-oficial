'use client';

import {useId,useState} from 'react';
import Link from 'next/link';
import {useJournalPreferences} from './journal-preferences';
import {trackEvent} from '@/lib/analytics';

const endpoint=process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT?.trim();

export function Newsletter(){
  const {locale}=useJournalPreferences();
  const id=useId().replace(/:/g,'');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [consent,setConsent]=useState(false);
  const [website,setWebsite]=useState('');
  const [state,setState]=useState<'idle'|'sending'|'success'|'error'>('idle');
  if(!endpoint||locale!=='pt')return null;
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!endpoint||website.trim()||!consent||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){setState('error');return}
    setState('sending');
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name.trim(),email:email.trim(),consent:true,source:'portfolio-diario'})});
      if(!response.ok)throw new Error('newsletter');
      setState('success');trackEvent('newsletter_signup');
    }catch{setState('error')}
  }
  return <section className="journal-newsletter section-wrap" aria-labelledby="newsletter-title"><span className="eyebrow">Correspondência</span><h2 id="newsletter-title">Uma nota na sua caixa de entrada.</h2><p>Quando houver um texto novo, posso te avisar por e-mail. Sem frequência prometida.</p>{state==='success'?<p className="newsletter-feedback" role="status">Inscrição recebida. Obrigado por acompanhar Pausa do café.</p>:<form onSubmit={submit} noValidate>
    <label htmlFor={`${id}-name`}>Nome <span className="optional">opcional</span><input id={`${id}-name`} value={name} onChange={event=>setName(event.target.value)} autoComplete="name" maxLength={100}/></label>
    <label htmlFor={`${id}-email`}>E-mail<input id={`${id}-email`} type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email" required aria-invalid={state==='error'&&!email.includes('@')}/></label>
    <label className="contact-honeypot" aria-hidden="true" htmlFor={`${id}-website`}>Deixe este campo vazio<input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={event=>setWebsite(event.target.value)}/></label>
    <label className="newsletter-consent" htmlFor={`${id}-consent`}><input id={`${id}-consent`} type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)} required/><span>Aceito receber os textos por e-mail e li a <Link href="/privacidade">política de privacidade</Link>.</span></label>
    <button className="pill filled" type="submit" disabled={state==='sending'}>{state==='sending'?'Enviando…':'Inscrever-me ↗'}</button>
    <p className="newsletter-feedback" role="status" aria-live="polite">{state==='error'?'Confira o e-mail e o consentimento. Se estiverem corretos, tente novamente mais tarde.':''}</p>
  </form>}</section>;
}
