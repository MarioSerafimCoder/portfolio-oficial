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
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:rooftop,start:'top 100%',end:'center 48%',scrub:.35}})
        .fromTo('.editorial-rooftop-mark',{x:desktop?62:10,scale:.96},{x:0,scale:1,duration:1},0)
        .fromTo('.editorial-rooftop-application',{x:desktop?-55:-8,rotation:desktop?-2:0},{x:0,rotation:0,duration:.8},.15);
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:simetria,start:'top 95%',end:'bottom 35%',scrub:.6}})
        .fromTo('.editorial-simetria-portrait',{y:desktop?24:8},{y:desktop?-28:-6,duration:1},0)
        .fromTo('.editorial-simetria-application',{y:desktop?-38:-10,rotation:desktop?-4:-1},{y:desktop?35:8,rotation:desktop?2:0,duration:1},0);
      gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.editorial-closing',start:'top 105%',end:'top 45%',scrub:.35}})
        .fromTo('.editorial-closing article:first-child',{rotation:desktop?-1.5:0,scale:.975},{rotation:0,scale:1,duration:.75},0)
        .fromTo('.editorial-closing article:last-child',{rotation:desktop?1.5:0,scale:.975},{rotation:0,scale:1,duration:.75},.18);
    });
    return () => media.revert();
  },{scope:root});
  return <div ref={root} className="editorial-projects" data-motion-owner="editorial">{children}</div>;
}
