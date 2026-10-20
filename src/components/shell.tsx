'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import Image from 'next/image';
import { ContactForm } from './contact';
import { JournalFooter } from './journal-footer';
import {JournalHeaderTools} from './journal-header-tools';
import {useJournalPreferences} from './journal-preferences';
import {ThemeToggle} from './theme-toggle';
import {SocialLinks} from './social-links';
import {showJournalNavigation} from '@/content/journal';
import {WhatsAppFloating} from './whatsapp-link';
import {WhatsAppLink} from './whatsapp-link';

export function Arrow({diagonal=false}:{diagonal?:boolean}) {return <span aria-hidden="true" className="arrow">{diagonal?'↗':'↗'}</span>}

export function Header(){
  const path=usePathname();
  const {locale}=useJournalPreferences();
  const isJournal=path==='/blog'||path.startsWith('/blog/');
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const [open,setOpen]=useState(false);
  const [closing,setClosing]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  function close(){if(!dialog.current?.open)return;setClosing(true);timer.current=setTimeout(()=>{dialog.current?.close();setClosing(false);setOpen(false);trigger.current?.focus({preventScroll:true})},matchMedia('(prefers-reduced-motion: reduce)').matches?0:260)}
  function show(){if(timer.current)clearTimeout(timer.current);setClosing(false);dialog.current?.showModal();setOpen(true)}
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open]);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
  return <>
    <header className={`site-header${isJournal?' journal-site-header':''}`}><Link className="wordmark" href="/" aria-label="Mário Serafim — início">MÁRIO SERAFIM</Link><div className="header-actions">{isJournal?<JournalHeaderTools/>:<span className="header-note">Direção de arte & design</span>}<div className="header-social"><SocialLinks/></div><ThemeToggle compact locale={isJournal?locale:'pt'}/><button ref={trigger} type="button" className="menu-trigger" aria-label={isJournal&&locale==='en'?'Open menu':'Abrir menu'} aria-expanded={open} aria-controls="site-menu" onClick={show}><span/><span/></button></div></header>
    <dialog ref={dialog} id="site-menu" aria-label="Navegação principal" className={`menu-dialog ${closing?'closing':''}`} onCancel={e=>{e.preventDefault();close()}} onClose={()=>setOpen(false)}>
      <div className="menu-top"><Link className="wordmark" href="/" onClick={close}>MÁRIO SERAFIM</Link><div className="menu-top-actions"><div className="menu-mobile-social"><SocialLinks/></div><button className="close-button" aria-label={isJournal&&locale==='en'?'Close menu':'Fechar menu'} onClick={close}>×</button></div></div>
      <div className="menu-content"><nav className="menu-links" aria-label={isJournal&&locale==='en'?'Main navigation':'Principal'}>{(isJournal&&locale==='en'?[['Projects','/projetos'],['About','/sobre'],...(showJournalNavigation?[['Pausa do café','/blog']]:[]),['Contact','/contato']]:[['Projetos','/projetos'],['Sobre','/sobre'],...(showJournalNavigation?[['Pausa do café','/blog']]:[]),['Contato','/contato']]).map(([label,url],i)=><Link key={url} href={url} aria-current={path===url?'page':undefined} onClick={close} style={{'--i':i} as React.CSSProperties}>{label}</Link>)}</nav><div className="menu-projects"><span className="eyebrow">{isJournal&&locale==='en'?'Featured':'Em foco'}</span>{[['Amazonita','amazonita','amazonita-cover'],['Rooftop Arquitetura','rooftop','rooftop-cover'],['Simetria Estética','simetria','simetria/portrait']].map(([name,slug,img])=><Link href={`/projetos/${slug}`} key={slug} onClick={close}><span className="menu-thumb"><Image src={`/media/${img}.webp`} alt="" fill sizes="110px"/></span><span><small>{isJournal&&locale==='en'?'Project':'Projeto'}</small>{name}</span><span aria-hidden="true">↗</span></Link>)}</div></div>
      <div className="menu-bottom"><div><span className="eyebrow">{isJournal&&locale==='en'?'An idea starts with a conversation.':'Uma ideia começa com uma conversa.'}</span><a className="text-link" href={`mailto:${site.email}`}>{site.email} ↗</a></div><div><SocialLinks variant="text"/><p>{isJournal&&locale==='en'?'Fortaleza, Brazil':'Fortaleza, Brasil'}</p></div></div>
    </dialog>
  </>;
}

export function Footer(){
  const path=usePathname();
  const {locale}=useJournalPreferences();
  const isJournal=path==='/blog'||path.startsWith('/blog/');
  const english=isJournal&&locale==='en';
  return <footer className="site-footer">
    {!isJournal&&path!=='/contato'&&<section id="contato" className="footer-conversion" aria-labelledby="contact-heading"><div className="contact-invitation"><span className="eyebrow">{path==="/"?"Vamos conversar":"O próximo capítulo"}</span><h2 id="contact-heading">{path==="/"?<>Me conta o que você<br/><em>tem em mente.</em></>:<>Toda marca tem um<br/><em>próximo capítulo.</em></>}</h2><p>{path==="/"?"Pode ser uma marca começando agora, um negócio que cresceu ou uma identidade que já não acompanha o seu trabalho. Não precisa chegar com tudo resolvido. Me conte um pouco sobre o projeto e a gente descobre por onde começar.":"Conte um pouco sobre o que você está construindo. O resto começa com uma conversa."}</p><WhatsAppLink context={path==='/sobre'?'a página Sobre':path.startsWith('/projetos/')?`o projeto ${path.split('/').pop()?.replace(/-/g,' ')}`:'seu trabalho'} className="text-link contact-whatsapp"/><span className="contact-signature">Mário Serafim / Direção de arte & identidade visual</span></div><ContactForm key={path}/></section>}
    {isJournal&&<JournalFooter article={path.startsWith('/blog/')&&!path.startsWith('/blog/categoria/')}/>}
    <div className="footer-secondary"><nav aria-label={english?'Footer':'Rodapé'}><Link href="/projetos">{english?'Projects':'Projetos'} ↗</Link><Link href="/sobre">{english?'About':'Sobre'} ↗</Link>{showJournalNavigation&&<Link href="/blog">Pausa do café ↗</Link>}<Link href="/contato">{english?'Contact':'Contato'} ↗</Link><Link href="/privacidade">{english?'Privacy':'Privacidade'}</Link></nav><div><a href={`mailto:${site.email}`}>{site.email} ↗</a><SocialLinks variant="text"/></div></div>
    <div className="footer-base"><Link href="/" className="wordmark">MÁRIO SERAFIM</Link><span>{english?'Art direction & visual identity · Fortaleza, Brazil':'Direção de arte & identidade visual · Fortaleza, Brasil'} · © {new Date().getFullYear()}</span></div>
    <WhatsAppFloating/>
  </footer>;
}

export function MotionObserver(){
  const path=usePathname();
  useEffect(()=>{
    const elements=document.querySelectorAll<HTMLElement>('[data-reveal]');
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}})},{threshold:0.08});
    elements.forEach(el=>{el.classList.add('will-reveal');observer.observe(el)});
    return()=>observer.disconnect();
  },[path]);
  return null;
}
