'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

/** Scroll remains native; only visible visual surfaces receive a transform. */
export function SpatialMotion(){
 const path=usePathname();
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const active=new Set<HTMLElement>();let frame=0;
  const paint=()=>{frame=0;if(reduced.matches)return;const height=innerHeight;active.forEach(el=>{const r=el.getBoundingClientRect();const entrance=Math.max(0,Math.min(1,(height-r.top)/(height*.65)));const travel=Math.max(-1,Math.min(1,(height/2-r.top-r.height/2)/height));el.style.setProperty('--arrival',entrance.toFixed(4));el.style.setProperty('--travel',travel.toFixed(4))})};
  const request=()=>{if(!frame&&!reduced.matches)frame=requestAnimationFrame(paint)};
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{const el=entry.target as HTMLElement;if(entry.isIntersecting)active.add(el);else active.delete(el)});request()},{rootMargin:'80px'});
  const targets=new Set<HTMLElement>();
  const register=()=>{document.querySelectorAll<HTMLElement>('.case-rail,.case-gallery figure,.about-portrait,.about-thinking,.about-credential-list article,.project-gallery .project-card,.home-feature,.case-navigation,.contact-page .contact-form,.journal-list>li,.journal-cover').forEach(el=>{if(targets.has(el))return;targets.add(el);el.classList.add('spatial-surface');observer.observe(el)});targets.forEach(el=>{if(!el.isConnected){observer.unobserve(el);targets.delete(el);active.delete(el)}})};
  register();const mutations=new MutationObserver(register);mutations.observe(document.getElementById('conteudo')||document.body,{childList:true,subtree:true});
  const preference=()=>{targets.forEach(el=>{el.style.removeProperty('--arrival');el.style.removeProperty('--travel')});request()};
  window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request,{passive:true});reduced.addEventListener('change',preference);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();mutations.disconnect();window.removeEventListener('scroll',request);window.removeEventListener('resize',request);reduced.removeEventListener('change',preference);targets.forEach(el=>{el.classList.remove('spatial-surface');el.style.removeProperty('--arrival');el.style.removeProperty('--travel')})};
 },[path]);
 return null;
}
