'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import { useEffect, useRef, type ReactNode } from 'react';
/** Native details retain keyboard and no-JS behavior; WAAPI animates the height. */
export function QuietDisclosures({ children }: {
    children: ReactNode;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const root = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const records = new Map<HTMLDetailsElement, {
            animation: Animation | null;
            handler: (event: MouseEvent) => void;
        }>();
        root.current?.querySelectorAll('details').forEach(details => {
            const summary = details.querySelector('summary')!;
            const record = { animation: null as Animation | null, handler: (_event: MouseEvent) => { } };
            record.handler = (event: MouseEvent) => {
                if (matchMedia('(prefers-reduced-motion: reduce)').matches)
                    return;
                event.preventDefault();
                const expanding = details.dataset.expanding === 'true' || (details.open && details.dataset.expanding !== 'false');
                const start = details.getBoundingClientRect().height;
                record.animation?.cancel();
                details.dataset.expanding = String(!expanding);
                details.open = true;
                const end = expanding ? summary.getBoundingClientRect().height : details.getBoundingClientRect().height;
                record.animation = details.animate({ height: [`${start}px`, `${end}px`] }, { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
                record.animation.onfinish = () => { details.open = !expanding; delete details.dataset.expanding; record.animation = null; };
            };
            summary.addEventListener('click', record.handler);
            records.set(details, record);
        });
        return () => records.forEach((record, details) => { record.animation?.cancel(); details.querySelector('summary')?.removeEventListener('click', record.handler); delete details.dataset.expanding; });
    }, []);
    return <div ref={root} className="quiet-disclosures" data-motion-owner="disclosure">{i18nText(children)}</div>;
}
