'use client';
import {useEffect, useRef} from 'react';
import {createSpring} from '@/lib/motion';

export function useProjectMotion() {
  const root = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const card = root.current;
    const image = card?.querySelector<HTMLElement>('.project-media>img');
    if (!card || !image) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const spring = createSpring(value => {image.style.transform = `scale(${1 + value * .025})`;});
    const tiltX=createSpring(value=>card.style.setProperty('--card-rx',value+'deg'));
    const tiltY=createSpring(value=>card.style.setProperty('--card-ry',value+'deg'));
    const move=(event:PointerEvent)=>{if(event.pointerType!=='mouse'||!pointer.matches||reduced.matches)return;const r=card.getBoundingClientRect();tiltX.to(-((event.clientY-r.top)/r.height-.5)*9);tiltY.to(((event.clientX-r.left)/r.width-.5)*12)};
    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && pointer.matches && !reduced.matches) spring.to(1);
    };
    const leave = () => {spring.to(0);tiltX.to(0);tiltY.to(0)};
    const reset = () => {spring.to(0,true);tiltX.to(0,true);tiltY.to(0,true)};
    card.addEventListener('pointermove',move,{passive:true});
    card.addEventListener('pointerenter', enter);
    card.addEventListener('pointerleave', leave);
    document.addEventListener('keydown', reset);
    reduced.addEventListener('change', reset);
    pointer.addEventListener('change', reset);
    return () => {
      tiltX.stop();tiltY.stop();card.removeEventListener('pointermove',move);card.style.removeProperty('--card-rx');card.style.removeProperty('--card-ry');
      spring.stop(); image.style.removeProperty('transform');
      card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave);
      document.removeEventListener('keydown', reset);
      reduced.removeEventListener('change', reset); pointer.removeEventListener('change', reset);
    };
  }, []);
  return root;
}
