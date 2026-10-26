'use client';

import {useRef,type ReactNode} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(ScrollTrigger,useGSAP);

/** Only the texture, title and application move here; the hero owns stage scale. */
export function AmazonitaExperience({children}:{children:ReactNode}){
  const root=useRef<HTMLElement>(null);
  useGSAP(()=>{
    const media=gsap.matchMedia();
    media.add({desktop:'(min-width: 701px)',mobile:'(max-width: 700px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
      if(context.conditions?.reduce)return;
      const desktop=context.conditions?.desktop;
      const timeline=gsap.timeline({scrollTrigger:{id:'amazonita-material',trigger:root.current,start:'top bottom',end:'bottom 30%',scrub:.4,invalidateOnRefresh:true},defaults:{ease:'none'}});
      timeline.fromTo('.material-texture',{scale:desktop?1.12:1.06,yPercent:-2},{scale:1,yPercent:2,duration:1},0)
        .fromTo('.material-stage h3',{y:desktop?65:22},{y:desktop?-45:-16,duration:1},0)
        .fromTo('.material-application',{y:desktop?65:20,rotation:desktop?3:0},{y:desktop?-28:0,rotation:0,duration:.65},.35);
    });
    return()=>media.revert();
  },{scope:root});
  return <article ref={root} className="material-feature" data-motion-owner="gsap" aria-labelledby="amazonita-feature-title">{children}</article>;
}
