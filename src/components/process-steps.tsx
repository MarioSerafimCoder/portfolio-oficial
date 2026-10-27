'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger, useGSAP);
type Step = {
    title: string;
    body: string;
};
export function ProcessSteps({ steps }: {
    steps: Step[];
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const root = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        const media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
            const items = Array.from(root.current!.querySelectorAll('li'));
            const timeline = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 40%', scrub: .3, onUpdate: self => { const active = Math.min(items.length - 1, Math.floor(self.progress * items.length)); items.forEach((item, i) => { item.dataset.active = String(i === active); if (i === active)
                        item.setAttribute('aria-current', 'step');
                    else
                        item.removeAttribute('aria-current'); }); } } });
            timeline.fromTo(root.current, { '--process-progress': 0 }, { '--process-progress': 1, ease: 'none' });
        });
        return () => { media.revert(); root.current?.querySelectorAll('li').forEach(item => { delete item.dataset.active; item.removeAttribute('aria-current'); }); };
    }, { scope: root });
    return <div ref={root} className="process-path" data-motion-owner="process"><div className="process-route" aria-hidden="true"><span /></div><ol className="process-steps">{i18nText(steps.map((step, index) => <li key={step.title}><span className="process-step-number">{i18nText("0")}{i18nText(index + 1)}</span><h3>{i18nText(step.title)}</h3><p>{i18nText(step.body)}</p></li>))}</ol></div>;
}
