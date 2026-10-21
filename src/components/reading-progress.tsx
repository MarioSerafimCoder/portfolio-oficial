'use client';
import {useEffect, useRef} from 'react';

export function ReadingProgress() {
  const indicator = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const body = document.querySelector<HTMLElement>('.journal-article-content');
    const line = indicator.current;
    if (!body || !line) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = body.getBoundingClientRect();
      const distance = Math.max(1, rect.height - innerHeight * .4);
      const progress = Math.max(0, Math.min(1, (innerHeight * .25 - rect.top) / distance));
      line.style.setProperty('--reading-progress', progress.toFixed(4));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', schedule, {passive: true});
    addEventListener('resize', schedule);
    return () => { removeEventListener('scroll', schedule); removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, []);
  return <div className="reading-progress" ref={indicator} aria-hidden="true"/>;
}
