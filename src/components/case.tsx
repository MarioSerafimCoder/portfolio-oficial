'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Project } from '@/content/projects';

export function CaseStory({project:p}:{project:Project}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [open,setOpen]=useState(false);
 useEffect(()=>{if(open){const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old}}},[open]);
 const close=()=>{dialog.current?.close();setOpen(false)};
 return <><button className="pill" onClick={()=>{dialog.current?.showModal();setOpen(true)}}>Ler a história completa <span aria-hidden="true">↗</span></button><dialog ref={dialog} className="story-dialog" aria-labelledby="story-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close()}}><div className="story-top"><span>Por trás do projeto</span><button className="close-button" aria-label="Fechar história" onClick={close}>×</button></div><h2 id="story-title">{p.name}</h2><p className="story-lead">{p.context}</p>{[['O desafio',p.challenge],['O objetivo',p.objective],['Meu papel',p.role],['As decisões',p.decisions],['O sistema',p.system],['Resultado observável',p.result],['Créditos',p.credits]].map(([label,text])=><section key={label}><h3>{label}</h3><p>{text}</p></section>)}</dialog></>;
}

export function Video({src,caption,poster='/media/amazonita-video-poster.webp'}:{src:string;caption:string;poster?:string}){
 const video=useRef<HTMLVideoElement>(null);const [playing,setPlaying]=useState(false);

 return <div className={`video-frame ${src==='/media/amazonita-motion.mp4'?'video-portrait':'video-landscape'}`}><video ref={video} poster={poster} playsInline muted loop controls preload="none" aria-label={caption} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}><source src={src} type="video/mp4"/>Seu navegador não suporta vídeo. <a href={src}>Baixar vídeo</a></video><button className="video-toggle" aria-label={playing?'Pausar vídeo':'Reproduzir vídeo'} onClick={()=>{if(playing)video.current?.pause();else video.current?.play().catch(()=>{})}}>{playing?'Pausar Ⅱ':'Reproduzir ▷'}</button></div>
}

export function CaseRail({project:p}:{project:Project}){
 const rail=useRef<HTMLDivElement>(null);const previews=[{src:p.cover,alt:p.coverAlt},...p.gallery.filter(m=>m.kind!=='video').slice(0,2)];
 return <><div className="case-rail" ref={rail} aria-label={`Prévia visual de ${p.name}`} tabIndex={0}>{previews.map((m,i)=><a className={`rail-frame rail-${i}`} href="#galeria" key={m.src} aria-label={`Explorar galeria: ${m.alt}`}><Image src={m.src} alt={m.alt} fill fetchPriority={i===0?'high':undefined} loading={i===0?'eager':'lazy'} sizes="(max-width:600px) 85vw, 65vw" style={{objectFit:i===0?'cover':'contain'}}/></a>)}</div><div className="rail-controls"><a href="#galeria" className="text-link">Explorar a galeria ↓</a><div><button className="round-button" aria-label="Imagem anterior" onClick={()=>rail.current?.scrollBy({left:-rail.current.clientWidth*.65,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>←</button><button className="round-button" aria-label="Próxima imagem" onClick={()=>rail.current?.scrollBy({left:rail.current.clientWidth*.65,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>→</button></div></div></>;
}

