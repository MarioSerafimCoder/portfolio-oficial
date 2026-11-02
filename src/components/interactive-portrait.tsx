'use client';

import Image from 'next/image';
import type {PointerEvent} from 'react';

type InteractivePortraitProps={src:string;alt:string;sizes:string};

export function InteractivePortrait({src,alt,sizes}:InteractivePortraitProps){
 const move=(event:PointerEvent<HTMLElement>)=>{
  if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const bounds=event.currentTarget.getBoundingClientRect();
  const x=(event.clientX-bounds.left)/bounds.width;
  const y=(event.clientY-bounds.top)/bounds.height;
  event.currentTarget.style.setProperty('--portrait-rotate-x',`${((.5-y)*3.2).toFixed(2)}deg`);
  event.currentTarget.style.setProperty('--portrait-rotate-y',`${((x-.5)*3.2).toFixed(2)}deg`);
  event.currentTarget.style.setProperty('--portrait-pointer-x',`${(x*100).toFixed(1)}%`);
  event.currentTarget.style.setProperty('--portrait-pointer-y',`${(y*100).toFixed(1)}%`);
 };
 const reset=(event:PointerEvent<HTMLElement>)=>{
  event.currentTarget.style.setProperty('--portrait-rotate-x','0deg');
  event.currentTarget.style.setProperty('--portrait-rotate-y','0deg');
  event.currentTarget.style.setProperty('--portrait-pointer-x','50%');
  event.currentTarget.style.setProperty('--portrait-pointer-y','50%');
 };
 return <figure className="about-portrait" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
  <Image src={src} alt={alt} width={520} height={520} sizes={sizes}/>
 </figure>;
}
