'use client';

import {useRef, type ReactNode} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ProjectChoreography({children}:{children:ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({desktop:'(min-width: 701px)',reduce:'(prefers-reduced-motion: reduce)'}, context => {
      if (context.conditions?.reduce) return;
      const desktop = context.conditions?.desktop;
      const rooftop = root.current!.querySelector('.editorial-rooftop');
      const simetria = root.current!.querySelector('.editorial-simetria');
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:rooftop,start:'top 95%',end:'center 40%',scrub:.4}})
        .fromTo('.editorial-rooftop-mark',{x:desktop?55:12},{x:0,duration:1},0)
        .fromTo('.editorial-rooftop-application',{x:desktop?-38:-10,y:20},{x:0,y:0,duration:.8},.2)
        .fromTo('.editorial-rooftop .editorial-intro',{y:22},{y:0,duration:.7},0);
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:simetria,start:'top 95%',end:'bottom 35%',scrub:.6}})
        .fromTo('.editorial-simetria-portrait',{y:desktop?32:10},{y:desktop?-22:-8,duration:1},0)
        .fromTo('.editorial-simetria .editorial-intro',{y:desktop?45:12},{y:0,duration:1},0)
        .fromTo('.editorial-simetria-application',{y:desktop?60:15,rotation:desktop?-3:0},{y:0,rotation:0,duration:1},0);
    });
    return () => media.revert();
  },{scope:root});
  return <div ref={root} className="editorial-projects" data-motion-owner="editorial">{children}</div>;
}
