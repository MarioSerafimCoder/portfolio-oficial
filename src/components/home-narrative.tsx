'use client';
import {useRef,type ReactNode} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
gsap.registerPlugin(ScrollTrigger,useGSAP);

/** Owns only the background curves and project-introduction gesture. */
export function HomeNarrative({children}:{children:ReactNode}){
 const root=useRef<HTMLElement>(null);
 useGSAP(()=>{
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   gsap.fromTo('.project-gesture path',{strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.projects-introduction',start:'top 95%',end:'center 65%',scrub:.25}});
   gsap.to('.project-current',{yPercent:-12,rotation:5,ease:'none',scrollTrigger:{trigger:'.selected-section',start:'top bottom',end:'bottom top',scrub:.6}});
  });
  return()=>media.revert();
 },{scope:root});
 return <main ref={root} id="conteudo" className="spatial-home" data-motion-owner="narrative">{children}</main>;
}
