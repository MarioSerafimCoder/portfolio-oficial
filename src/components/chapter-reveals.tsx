'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

/** Only selected visual surfaces get an entrance. Copy and controls stay visible. */
export function ChapterReveals(){
 const path=usePathname();
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches)return;
  const targets=new Set<HTMLElement>();
  const finish=(el:HTMLElement)=>{el.dataset.revealState='done';observer.unobserve(el)};
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)finish(entry.target as HTMLElement)}),{rootMargin:'0px 0px 12% 0px',threshold:0});
  document.querySelectorAll<HTMLElement>('.case-gallery .gallery-image,.about-portrait,.journal-cover,.palette>div,[data-chapter-reveal]').forEach(el=>{
   if(el.closest('[data-motion-owner],.spatial-home,.site-footer'))return;
   targets.add(el);el.dataset.revealKind='surface';
   el.dataset.revealState=el.getBoundingClientRect().top<innerHeight?'done':'waiting';observer.observe(el);
  });
  const revealFocus=(event:FocusEvent)=>{const target=(event.target as HTMLElement).closest<HTMLElement>('[data-reveal-state]');if(target)finish(target)};
  const reduce=()=>{if(preference.matches)targets.forEach(finish)};
  document.addEventListener('focusin',revealFocus);preference.addEventListener('change',reduce);
  return()=>{observer.disconnect();document.removeEventListener('focusin',revealFocus);preference.removeEventListener('change',reduce);targets.forEach(el=>{delete el.dataset.revealKind;delete el.dataset.revealState})};
 },[path]);
 return null;
}
