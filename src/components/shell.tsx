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
import {createSpring} from '@/lib/motion';

export function Arrow({diagonal=false}:{diagonal?:boolean}) {return <span aria-hidden="true" className="arrow">{diagonal?'↗':'↗'}</span>}

export function Header(){
  const path=usePathname();
  const {locale}=useJournalPreferences();
  const isJournal=path==='/blog'||path.startsWith('/blog/');
  const dialog=useRef<HTMLDialogElement>(null);
  const header=useRef<HTMLElement>(null);
  const [preview,setPreview]=useState(0);
  const previews=['amazonita-cover','rooftop-cover','simetria/portrait'];
  const trigger=useRef<HTMLButtonElement>(null);
  const [open,setOpen]=useState(false);
  const motion=useRef<ReturnType<typeof createSpring>|null>(null);
  const destination=useRef(0);
  function instant(){return matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.input==='keyboard'}
  function finishClose(){dialog.current?.close();setOpen(false);trigger.current?.focus({preventScroll:true})}
  function close(){if(!dialog.current?.open)return;destination.current=0;motion.current?.to(0,instant(),finishClose)}
  function navigate(){destination.current=0;motion.current?.to(0,true);dialog.current?.close();setOpen(false)}
  function show(){if(!dialog.current)return;setPreview(0);dialog.current.showModal();destination.current=1;setOpen(true);motion.current?.to(1,instant())}
  useEffect(()=>{
    motion.current=createSpring(value=>{if(dialog.current){dialog.current.style.setProperty('--menu-progress',String(value));dialog.current.style.opacity=String(value);dialog.current.style.transform=`translateY(${(1-value)*-12}px)`}});
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const settle=()=>{if(preference.matches)motion.current?.to(destination.current,true,destination.current===0?finishClose:undefined)};
    const keyboard=()=>motion.current?.to(destination.current,true,destination.current===0?finishClose:undefined);
    preference.addEventListener('change',settle);document.addEventListener('keydown',keyboard);
    return()=>{motion.current?.stop();preference.removeEventListener('change',settle);document.removeEventListener('keydown',keyboard)};
  },[]);
  useEffect(()=>{
    const compact=()=>{if(header.current)header.current.dataset.compact=String(window.scrollY>65)};
    compact();window.addEventListener('scroll',compact,{passive:true});
    return()=>window.removeEventListener('scroll',compact);
  },[]);
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open]);
  return <>
    <header ref={header} className={`site-header${isJournal?' journal-site-header':''}`}><Link className="wordmark" href="/" aria-label="Mário Serafim — início">Mário <em>Serafim</em></Link><div className="header-actions">{isJournal?<JournalHeaderTools/>:<nav className="header-nav" aria-label="Acessos rápidos"><Link href="/projetos" prefetch={false}>Projetos</Link>{path==='/'?<a href="#contato">Contato <span aria-hidden="true">↗</span></a>:<Link href="/contato">Contato <span aria-hidden="true">↗</span></Link>}</nav>}<div className="header-social"><SocialLinks/></div><ThemeToggle compact locale={isJournal?locale:'pt'}/><button ref={trigger} type="button" className="menu-trigger" aria-label={isJournal&&locale==='en'?'Open menu':'Abrir menu'} aria-expanded={open} aria-controls="site-menu" onClick={show}><span className="menu-label">Menu</span><span className="menu-icon"><i/><i/></span></button></div></header>
    <dialog ref={dialog} id="site-menu" aria-label="Navegação principal" className="menu-dialog" onCancel={e=>{e.preventDefault();close()}} onClose={()=>setOpen(false)}>
      <div className="menu-top"><Link className="wordmark" href="/" onClick={navigate}>Mário <em>Serafim</em></Link><div className="menu-top-actions"><div className="menu-mobile-social"><SocialLinks/></div><button className="close-button" aria-label={isJournal&&locale==='en'?'Close menu':'Fechar menu'} onClick={close}>×</button></div></div>
      <div className="menu-content"><nav className="menu-links" aria-label={isJournal&&locale==='en'?'Main navigation':'Principal'}>{(isJournal&&locale==='en'?[['Projects','/projetos'],['About','/sobre'],...(showJournalNavigation?[['Pausa do café','/blog']]:[]),['Contact','/contato']]:[['Projetos','/projetos'],['Sobre','/sobre'],...(showJournalNavigation?[['Pausa do café','/blog']]:[]),['Contato','/contato']]).map(([label,url],i)=><Link key={url} href={url} onMouseEnter={()=>setPreview(i%3)} onFocus={()=>setPreview(i%3)} aria-current={path===url?'page':undefined} onClick={navigate} style={{'--i':i} as React.CSSProperties}>{label}</Link>)}</nav><div className="menu-projects"><div className="menu-preview" aria-hidden="true">{previews.map((image,index)=><Image key={image} src={`/media/${image}.webp`} alt="" fill sizes="(max-width:700px) 90vw, 46vw" data-active={preview===index}/>)}</div><span className="eyebrow">{isJournal&&locale==='en'?'Featured':'Em foco'}</span>{[['Amazonita','amazonita','amazonita-cover'],['Rooftop Arquitetura','rooftop','rooftop-cover'],['Simetria Estética','simetria','simetria/portrait']].map(([name,slug,img],i)=><Link href={`/projetos/${slug}`} key={slug} onClick={navigate} onMouseEnter={()=>setPreview(i)} onFocus={()=>setPreview(i)} data-active={preview===i}><span className="menu-thumb"><Image src={`/media/${img}.webp`} alt="" fill sizes="110px"/></span><span><small>{isJournal&&locale==='en'?'Project':'Projeto'}</small>{name}</span><span aria-hidden="true">↗</span></Link>)}</div></div>
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
  useEffect(()=>{
    const keyboard=()=>{document.documentElement.dataset.input='keyboard'};
    const pointer=()=>{document.documentElement.dataset.input='pointer'};
    document.addEventListener('keydown',keyboard,true);
    document.addEventListener('pointerdown',pointer,true);
    document.addEventListener('pointermove',pointer,{passive:true});
    return()=>{document.removeEventListener('keydown',keyboard,true);document.removeEventListener('pointerdown',pointer,true);document.removeEventListener('pointermove',pointer)};
  },[]);
  return null;
}
