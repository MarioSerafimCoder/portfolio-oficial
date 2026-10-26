'use client';

import {useEffect, useRef, type ReactNode} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import {perceptionMotion} from '@/lib/perception-motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);
type Scene = ReturnType<typeof import('@/lib/ribbon-scene').createRibbonScene>;

export function PerceptionHero({children}: {children: ReactNode}) {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<Scene | null>(null);
  const progress = useRef({value: 0});
  useEffect(() => {
    let cancelled = false;
    let started = false;
    const mobile = matchMedia('(max-width: 700px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const load = () => {
      if (started || cancelled || reduced.matches) return;
      const rect = root.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > innerHeight) return;
      started = true;
      import('@/lib/ribbon-scene').then(({createRibbonScene}) => {
        if (cancelled || !host.current || !root.current) return;
        scene.current = createRibbonScene(host.current, root.current);
        scene.current.progress(progress.current.value);
      }).catch(() => { /* Static sculpture stays visible when WebGL is unavailable. */ });
    };
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      // Mobile starts from the composed fallback, upgrading on scroll or touch.
      if (!mobile.matches) load();
    }, {rootMargin:'100px'});
    if (root.current) observer.observe(root.current);
    window.addEventListener('scroll',load,{passive:true});
    root.current?.addEventListener('pointerdown',load,{passive:true});
    reduced.addEventListener('change',load);
    const hero = root.current;
    return () => {cancelled = true; observer.disconnect(); window.removeEventListener('scroll',load);hero?.removeEventListener('pointerdown',load);reduced.removeEventListener('change',load);scene.current?.dispose(); scene.current = null;};
  }, []);
  useEffect(() => {
    const button = root.current?.querySelector<HTMLElement>('.perception-support .pill');
    if (!button) return;
    const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const move = (event: PointerEvent) => {
      if (!allowed.matches) return;
      const box = button.getBoundingClientRect();
      gsap.to(button, {x:Math.max(-5,Math.min(5,(event.clientX-box.left-box.width/2)*.055)),y:Math.max(-3,Math.min(3,(event.clientY-box.top-box.height/2)*.12)),duration:.35,overwrite:true});
    };
    const reset = () => gsap.to(button,{x:0,y:0,duration:.35,overwrite:true});
    button.addEventListener('pointermove',move); button.addEventListener('pointerleave',reset); button.addEventListener('focus',reset);
    allowed.addEventListener('change',reset);
    return () => {button.removeEventListener('pointermove',move);button.removeEventListener('pointerleave',reset);button.removeEventListener('focus',reset);allowed.removeEventListener('change',reset);gsap.killTweensOf(button);};
  }, []);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({desktop:'(min-width: 701px)', reduce:'(prefers-reduced-motion: reduce)'}, context => {
      if (context.conditions?.reduce) {scene.current?.progress(0); return;}
      const desktop = context.conditions?.desktop;
      const hero = root.current!;
      const first = hero.parentElement!.querySelector('.material-stage');
      const timeline = gsap.timeline({defaults:{ease:'none'}, scrollTrigger:{
        id:'perception-handoff', trigger:hero, start:'top top', endTrigger:first,
        end:'top 30%', scrub:perceptionMotion.scrub, invalidateOnRefresh:true,
      }});
      timeline.to(progress.current,{value:1, onUpdate:() => scene.current?.progress(progress.current.value), duration:1},0)
        .to('.perception-heading',{y:desktop ? -62 : -20, duration:.7},0)
        .to('.ribbon-composition',{y:desktop ? 115 : 35, rotation:desktop ? 8 : 3, duration:1},0);
      if (first) timeline.fromTo(first,{scale:desktop ? .91 : .97},{scale:1,duration:.55},.45);
      if (window.scrollY < 80) {
        gsap.timeline({defaults:{ease:'power3.out'}})
          .from('[data-perception-line]',{y:20,opacity:.75,duration:.65,stagger:.09,clearProps:'transform,opacity'},0)
          .from('.perception-label,.perception-support',{y:9,opacity:.7,duration:.6,clearProps:'transform,opacity'},.12);
      }
    });
    return () => media.revert();
  }, {scope:root});
  return <section ref={root} className="perception-hero" data-motion-owner="gsap" aria-labelledby="perception-title">
    <div className="ribbon-composition" aria-hidden="true"><div className="ribbon-shadow"/><div ref={host} className="ribbon-scene"><img className="ribbon-fallback" src="/media/perception-ribbon.svg" alt="" width="760" height="650" fetchPriority="high"/></div></div>
    {children}
  </section>;
}
