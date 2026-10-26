'use client';

import {useRef,type ReactNode} from 'react';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(useGSAP);

/** The red frame travels across the words, then becomes a quiet, static lens. */
export function PerceptionHero({children}:{children:ReactNode}){
  const root=useRef<HTMLElement>(null);
  useGSAP(()=>{
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      if(window.scrollY>80)return;
      const lines=root.current!.querySelectorAll('[data-perception-line]');
      const lens=root.current!.querySelector('.perception-lens');
      const timeline=gsap.timeline({defaults:{ease:'power3.out'}});
      timeline.from(lines,{yPercent:22,opacity:.55,clipPath:'inset(0 0 38% 0)',duration:.85,stagger:.13,clearProps:'transform,opacity,clipPath'},0)
        .fromTo(lens,{xPercent:-55,scale:.42,rotation:-28,opacity:.15},{xPercent:0,scale:1,rotation:0,opacity:1,duration:1.25,clearProps:'transform,opacity'},.08);
      // The visitor can skip the opening simply by moving on.
      const finish=()=>{if(window.scrollY>80)timeline.progress(1).pause()};
      window.addEventListener('scroll',finish,{passive:true});
      return()=>window.removeEventListener('scroll',finish);
    });
    return()=>media.revert();
  },{scope:root});
  return <section ref={root} className="perception-hero" data-motion-owner="gsap" aria-labelledby="perception-title">
    <svg className="perception-lens" viewBox="0 0 700 400" fill="none" aria-hidden="true"><ellipse cx="350" cy="200" rx="324" ry="158" transform="rotate(-12 350 200)"/></svg>
    {children}
  </section>;
}
