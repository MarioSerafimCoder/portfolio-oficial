'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import { useEffect, useRef } from 'react';
const first = 'Prefiro fazer boas perguntas';
const second = 'antes de abrir um arquivo.';
export function ScrollHighlight() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const firstLine=i18nText(first);const secondLine=i18nText(second);const wordCount=(firstLine+' '+secondLine).split(' ').length;
    const heading = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        const element = heading.current;
        if (!element)
            return;
        const preference = matchMedia('(prefers-reduced-motion: reduce)');
        const spans = [...element.querySelectorAll<HTMLElement>('[data-highlight-word]')];
        let frame = 0;
        const update = () => {
            frame = 0;
            if (preference.matches) {
                spans.forEach(span => { span.style.setProperty('--word-mix', '100%'); span.style.setProperty('--word-progress', '1'); });
                return;
            }
            const rect = element.getBoundingClientRect();
            const distance = Math.min(innerHeight * .48, 360);
            const start = innerHeight * .78;
            const progress = Math.max(0, Math.min(1, (start - rect.top) / distance));
            spans.forEach((span, index) => {
                const amount = Math.max(0, Math.min(1, progress * wordCount - index));
                span.style.setProperty('--word-mix', `${Math.round(90 + amount * 10)}%`);
                span.style.setProperty('--word-progress', String(amount));
            });
        };
        const schedule = () => { if (!frame)
            frame = requestAnimationFrame(update); };
        update();
        addEventListener('scroll', schedule, { passive: true });
        addEventListener('resize', schedule);
        preference.addEventListener('change', schedule);
        return () => { removeEventListener('scroll', schedule); removeEventListener('resize', schedule); preference.removeEventListener('change', schedule); cancelAnimationFrame(frame); };
    }, [wordCount]);
    return <h2 className="scroll-highlight" ref={heading} aria-label={i18nText(`${firstLine} ${secondLine}`)}>
    <span aria-hidden="true">{i18nText(firstLine.split(' ').map((word, index) => <span data-highlight-word key={index}>{i18nText(word)}{i18nText(index < firstLine.split(' ').length - 1 ? ' ' : '')}</span>))}</span><br />
    <em aria-hidden="true">{i18nText(secondLine.split(' ').map((word, index) => <span data-highlight-word key={index}>{i18nText(word)}{i18nText(index < secondLine.split(' ').length - 1 ? ' ' : '')}</span>))}</em>
  </h2>;
}
