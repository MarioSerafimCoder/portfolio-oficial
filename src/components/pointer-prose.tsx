'use client';

import type {PointerEvent} from 'react';

export function PointerProse({paragraphs}:{paragraphs:string[]}) {
  function follow(event:PointerEvent<HTMLParagraphElement>) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const paragraph=event.currentTarget;
    const bounds=paragraph.getBoundingClientRect();
    paragraph.style.setProperty('--pointer-x',`${event.clientX-bounds.left}px`);
    paragraph.style.setProperty('--pointer-y',`${event.clientY-bounds.top}px`);
  }

  return <div className="about-thinking-copy">{paragraphs.map((paragraph,index)=><p key={index} onPointerMove={follow}>{paragraph}</p>)}</div>;
}
