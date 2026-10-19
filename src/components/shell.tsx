'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import Image from 'next/image';

export function Arrow({diagonal=false}:{diagonal?:boolean}) {return <span aria-hidden="true" className="arrow">{diagonal?'↗':'↗'}</span>}

export function ThemeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{setDark(document.documentElement.dataset.theme==='dark');},[]);
  function toggle(){const value=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=value?'dark':'light';setDark(value);try{localStorage.setItem('ms-theme',value?'dark':'light')}catch{}}
  return <button className="theme-toggle" aria-label={dark?'Tema escuro. Ativar tema claro':'Tema claro. Ativar tema escuro'} aria-pressed={dark} onClick={toggle}><span className="theme-orbit" aria-hidden="true"/><span>{dark?'Escuro':'Claro'}</span></button>;
}

export function Header(){
  const path=usePathname();
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const [open,setOpen]=useState(false);
  const [closing,setClosing]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  function close(){if(!dialog.current?.open)return;setClosing(true);timer.current=setTimeout(()=>{dialog.current?.close();setClosing(false);setOpen(false);trigger.current?.focus()},260)}
  function show(){if(timer.current)clearTimeout(timer.current);setClosing(false);dialog.current?.showModal();setOpen(true)}
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open]);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
  return <>
    <header className="site-header"><Link className="wordmark" href="/" aria-label="Mário Serafim — início">MÁRIO SERAFIM</Link><div className="header-actions"><span className="header-note">Direção de arte & design</span><button ref={trigger} type="button" className="menu-trigger" aria-label="Abrir menu" aria-expanded={open} aria-controls="site-menu" onClick={show}><span/><span/></button></div></header>
    <dialog ref={dialog} id="site-menu" aria-label="Navegação principal" className={`menu-dialog ${closing?'closing':''}`} onCancel={e=>{e.preventDefault();close()}} onClose={()=>setOpen(false)}>
      <div className="menu-top"><Link className="wordmark" href="/" onClick={close}>MÁRIO SERAFIM</Link><button className="close-button" aria-label="Fechar menu" onClick={close}>×</button></div>
      <div className="menu-content"><nav className="menu-links" aria-label="Principal">{[['Projetos','/projetos'],['Sobre','/sobre'],['Contato','/contato']].map(([label,url],i)=><Link key={url} href={url} aria-current={path===url?'page':undefined} onClick={close} style={{'--i':i} as React.CSSProperties}>{label}</Link>)}</nav><div className="menu-projects"><span className="eyebrow">Em foco</span>{[['Rooftop Arquitetura','rooftop','rooftop-cover'],['Simetria Estética','simetria','simetria/portrait'],['Amazonita','amazonita','amazonita-cover']].map(([name,slug,img])=><Link href={`/projetos/${slug}`} key={slug} onClick={close}><span className="menu-thumb"><Image src={`/media/${img}.webp`} alt="" fill sizes="110px"/></span><span><small>Projeto</small>{name}</span><span aria-hidden="true">↗</span></Link>)}</div></div>
      <div className="menu-bottom"><div><span className="eyebrow">Uma ideia começa com uma conversa.</span><a className="text-link" href={`mailto:${site.email}`}>{site.email} ↗</a></div><div><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><p>Fortaleza, Brasil</p></div></div>
    </dialog>
  </>;
}

export function Footer(){return <footer className="site-footer"><div className="footer-intro"><span>O próximo capítulo</span><span>Direção de arte, de perto.</span></div><nav aria-label="Rodapé" className="footer-links"><Link href="/projetos">Projetos <Arrow/></Link><Link href="/sobre">Sobre <Arrow/></Link><Link href="/contato">Vamos conversar <Arrow/></Link></nav><div className="footer-contact"><a href={`mailto:${site.email}`}>{site.email} ↗</a><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div><div className="footer-base"><Link href="/" className="wordmark">MÁRIO SERAFIM</Link><span>Fortaleza, Brasil · © {new Date().getFullYear()}</span><ThemeToggle/></div></footer>}

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

