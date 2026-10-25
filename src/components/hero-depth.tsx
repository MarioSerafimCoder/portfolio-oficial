'use client';

import {useEffect, useRef, type ReactNode} from 'react';
import {IdentitySculpture} from './identity-sculpture';
import {createSpring} from '@/lib/motion';

/** Keep content server rendered; only the visible hero owns a scroll frame. */
export function HeroDepth({children}:{children:ReactNode}) {
  const root=useRef<HTMLElement>(null);
  useEffect(()=>{
    const element=root.current;
    if(!element)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const fine=matchMedia('(hover: hover) and (pointer: fine)');
    let visible=false, frame=0;
    const x=createSpring(value=>element.style.setProperty('--hero-x',String(value)));
    const y=createSpring(value=>element.style.setProperty('--hero-y',String(value)));
    const reset=()=>{x.to(0,true);y.to(0,true);element.style.setProperty('--hero-progress','0')};
    const paint=()=>{
      frame=0;
      if(reduced.matches||!visible)return;
      const bounds=element.getBoundingClientRect();
      element.style.setProperty('--hero-progress',String(Math.max(0,Math.min(1,-bounds.top/bounds.height))));
    };
    const scroll=()=>{if(visible&&!reduced.matches&&!frame)frame=requestAnimationFrame(paint)};
    const move=(event:PointerEvent)=>{
      if(!visible||reduced.matches||!fine.matches||event.pointerType!=='mouse')return;
      const bounds=element.getBoundingClientRect();
      x.to((event.clientX-bounds.left)/bounds.width-.5);
      y.to((event.clientY-bounds.top)/bounds.height-.5);
    };
    const leave=()=>{x.to(0,reduced.matches);y.to(0,reduced.matches)};
    const preference=()=>{reset();scroll()};
    const observer=new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting;
      if(visible)scroll();else{x.stop();y.stop();cancelAnimationFrame(frame);frame=0}
    });
    observer.observe(element);
    element.addEventListener('pointermove',move,{passive:true});
    element.addEventListener('pointerleave',leave);
    window.addEventListener('scroll',scroll,{passive:true});
    window.addEventListener('resize',scroll,{passive:true});
    reduced.addEventListener('change',preference);
    fine.addEventListener('change',preference);
    return()=>{observer.disconnect();x.stop();y.stop();cancelAnimationFrame(frame);element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);reduced.removeEventListener('change',preference);fine.removeEventListener('change',preference)};
  },[]);
  return <section ref={root} className="home-hero"><IdentitySculpture/>{children}</section>;
}
