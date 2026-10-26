'use client';

import {useRef,type ReactNode} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(ScrollTrigger,useGSAP);

/** Native scrolling, no pin: the material opens into its complete composition. */
export function AmazonitaExperience({children}:{children:ReactNode}){
  const root=useRef<HTMLElement>(null);
  useGSAP(()=>{
    const media=gsap.matchMedia();
    media.add({desktop:'(min-width: 701px)',mobile:'(max-width: 700px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
      if(context.conditions?.reduce)return;
      const desktop=context.conditions?.desktop;
      const stage=root.current!.querySelector('.material-stage');
      const image=root.current!.querySelector('.material-texture');
      const caption=root.current!.querySelector('.material-caption');
      const timeline=gsap.timeline({scrollTrigger:{id:'amazonita-material',trigger:root.current,start:'top 88%',end:desktop?'top 5%':'top 28%',scrub:desktop ? 0.45 : true,invalidateOnRefresh:true},defaults:{ease:'none'}});
      timeline.fromTo(stage,{clipPath:desktop?'inset(7% 5%)':'inset(3% 2%)'},{clipPath:'inset(0%)',duration:1},0)
        .fromTo(image,{scale:desktop?1.065:1.025},{scale:1,duration:1},0)
        .fromTo(caption,{y:desktop?22:10,opacity:.65},{y:0,opacity:1,duration:.55},.4);
      const reveal=()=>timeline.progress(1);
      root.current!.addEventListener('focusin',reveal);
      return()=>root.current?.removeEventListener('focusin',reveal);
    });
    return()=>media.revert();
  },{scope:root});
  return <article ref={root} className="material-feature" data-motion-owner="gsap" aria-labelledby="amazonita-feature-title">{children}</article>;
}
