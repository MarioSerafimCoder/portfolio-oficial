'use client';

import type {PointerEvent} from 'react';

type Step = {title:string; body:string};

export function ProcessSteps({steps}:{steps:Step[]}) {
  function followPointer(event:PointerEvent<HTMLLIElement>) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const row = event.currentTarget;
    const bounds = row.getBoundingClientRect();
    row.style.setProperty('--pointer-x', `${event.clientX-bounds.left}px`);
    row.style.setProperty('--pointer-y', `${event.clientY-bounds.top}px`);
  }

  return <ol className="process-steps">{steps.map((step,index) =>
    <li key={step.title} onPointerMove={followPointer}>
      <span className="process-step-number">0{index+1}</span>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </li>
  )}</ol>;
}
