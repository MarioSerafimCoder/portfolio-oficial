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
    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && pointer.matches && !reduced.matches) spring.to(1);
    };
    const leave = () => spring.to(0);
    const reset = () => spring.to(0, true);
    card.addEventListener('pointerenter', enter);
    card.addEventListener('pointerleave', leave);
    document.addEventListener('keydown', reset);
    reduced.addEventListener('change', reset);
    pointer.addEventListener('change', reset);
    return () => {
      spring.stop(); image.style.removeProperty('transform');
      card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave);
      document.removeEventListener('keydown', reset);
      reduced.removeEventListener('change', reset); pointer.removeEventListener('change', reset);
    };
  }, []);
  return root;
}
