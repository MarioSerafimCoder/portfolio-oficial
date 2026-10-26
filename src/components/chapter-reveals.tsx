'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

const groups:Record<string,string>={
 title:'.section-heading h2,.faq-section h2,.about-origin h2,.about-credentials h2,.about-ending h2,.about-thinking h2,.case-story h2,.case-decisions h2,.case-contact h2,.journal-article-content h2,.contact-aside h2,.privacy-page h2',
 curtain:'.contact-invitation h2,.case-result p,.about-opening-bottom,.services-contact>p,.journal-footer-invitation h2',
 image:'.project-media,.feature-media,.case-gallery .gallery-image,.case-gallery .video-frame,.about-portrait img,.journal-cover img,.journal-article-content figure img',
 service:'.service-row',
 step:'.process-steps li',
 question:'.faq-section details',
 copy:'.home-section-intro,.home-feature-note,.project-caption,.feature-overlay,.home-process-intro p,.thinking-bottom>.pill,.home-process>p,.case-facts>div,.case-story dl>div,.case-decisions h3,.case-decisions p,.case-credits p,.case-testimonial blockquote,.about-prose p,.about-credentials-head p,.about-ending p,.about-ending-actions,.contact-invitation>p,.contact-invitation>.text-link,.contact-signature,.contact-aside>p,.contact-aside>div,.contact-place,.journal-post-byline,.journal-article-content blockquote,.journal-author,.journal-sources,.footer-secondary>div,.footer-base,main .eyebrow,.site-footer .eyebrow,.about-thinking-copy p,.journal-footer-invitation p,.journal-footer-invitation>.text-link,.privacy-page section>p,.materials-intro>p,.materials-intro>div',
 swatch:'.palette>div',
 ledger:'.about-credential-list article,.journal-list>li,.project-index>a',
 panel:'.contact-form',
 link:'.footer-secondary nav>a,.case-navigation>a',
};

/** Enhances existing semantic DOM; content is visible without JS and on focus. */
export function ChapterReveals(){
 const path=usePathname();
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const registered=new Set<HTMLElement>();
  const pending=new Set<HTMLElement>();let frame=0;
  const finish=(el:HTMLElement)=>{el.dataset.revealState='done';el.classList.remove('motion-pending');el.classList.add('revealed');pending.delete(el)};
  const enter=(el:HTMLElement)=>{if(el.dataset.revealState!=='waiting')return;el.dataset.revealState=reduced.matches?'done':'entering';pending.delete(el)};
  // Fully clipped elements have an empty IntersectionObserver intersection. Measure
  // their layout boxes in one read phase, then reveal in a separate write phase.
  const scan=()=>{frame=0;const ready=[...pending].map(el=>({el,box:el.getBoundingClientRect()})).filter(({box})=>box.top<innerHeight*.88);ready.forEach(({el,box})=>{if(box.bottom<0)finish(el);else enter(el)})};
  const schedule=()=>{if(!frame&&pending.size)frame=requestAnimationFrame(scan)};
  const register=()=>{
   for(const [kind,selector] of Object.entries(groups))document.querySelectorAll<HTMLElement>(selector).forEach((el,index)=>{
    if(registered.has(el)||el.closest('.site-header,.menu-dialog,.home-hero,[data-motion-owner]'))return;
    registered.add(el);el.dataset.revealKind=kind==='image'?(index%3===0?'image-rise':index%3===1?'image-left':'image-center'):kind;
    // Bound the stagger to avoid long waits even in a large gallery.
    const siblings=el.parentElement?Array.from(el.parentElement.children):[];
    const position=siblings.indexOf(el);
    el.style.setProperty('--reveal-delay',`${['swatch','link','step','ledger'].includes(kind)?Math.max(0,position%4)*75:0}ms`);
    const r=el.getBoundingClientRect();
    if(reduced.matches||r.bottom<0||r.top<innerHeight*.2){el.dataset.revealState='done';return}
    el.dataset.revealState='waiting';pending.add(el);
   });
   registered.forEach(el=>{if(!el.isConnected){pending.delete(el);registered.delete(el)}});schedule();
  };
  const complete=(event:AnimationEvent)=>{const el=event.target as HTMLElement;if(el.dataset.revealState==='entering'&&event.animationName.startsWith('chapter-'))finish(el)};
  const focus=(event:FocusEvent)=>{(event.target as HTMLElement).querySelectorAll<HTMLElement>('[data-reveal-state]').forEach(finish);let el=(event.target as HTMLElement).closest<HTMLElement>('[data-reveal-state]');while(el){finish(el);el=el.parentElement?.closest<HTMLElement>('[data-reveal-state]')||null}};
  const preference=()=>{if(reduced.matches)registered.forEach(finish)};
  register();
  const mutations=new MutationObserver(register);mutations.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('animationend',complete);document.addEventListener('focusin',focus);reduced.addEventListener('change',preference);
  // Fragment links and restored scroll must never leave their destination masked.
  const fragment=()=>{if(!location.hash)return;let id=location.hash.slice(1);try{id=decodeURIComponent(id)}catch{/* Keep malformed fragments harmless. */}const target=document.getElementById(id);if(target)registered.forEach(el=>{if(target===el||target.contains(el))finish(el)})};
  window.addEventListener('hashchange',fragment);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);fragment();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);mutations.disconnect();document.removeEventListener('animationend',complete);document.removeEventListener('focusin',focus);reduced.removeEventListener('change',preference);window.removeEventListener('hashchange',fragment);registered.forEach(el=>{delete el.dataset.revealState;delete el.dataset.revealKind;el.style.removeProperty('--reveal-delay')})};
 },[path]);
 return null;
}
