'use client';
import {originalPath} from '@/i18n/routes';
import {useSiteTranslation} from '@/i18n/use-translation';
import { usePathname } from 'next/navigation';
import { whatsappLink } from '@/lib/site-links';
import { site } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { useEffect, useState } from 'react';
export function WhatsAppLink({ context, className = '', label = 'Conversar pelo WhatsApp' }: {
    context: string;
    className?: string;
    label?: string;
}) {
    const { i18nText, i18nHref, locale } = useSiteTranslation();
    const href = whatsappLink(i18nText(context),locale);
    if (!href)
        return null;
    return <a className={className} href={i18nHref(href)} target="_blank" rel="noopener noreferrer" aria-label={i18nText(`${label} com Mário (abre em nova aba)`)} onClick={() => trackEvent('whatsapp_click', { page: context })}>{i18nText(label)}<span aria-hidden="true">{i18nText("\u2197")}</span></a>;
}
export function BookingLink({ className = '' }: {
    className?: string;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    if (!site.bookingUrl)
        return null;
    return <a className={className} href={i18nHref(site.bookingUrl)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('booking_click')}>{i18nText("Agendar uma conversa de 20 min ")}<span aria-hidden="true">{i18nText("\u2197")}</span><span className="sr-only">{i18nText("Abre em nova aba")}</span></a>;
}
export function WhatsAppFloating() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const path = originalPath(usePathname());
    const [contactVisible, setContactVisible] = useState(path === '/');
    useEffect(() => {
        const targets = Array.from(document.querySelectorAll('.perception-hero,.material-feature,.contact-form,.faq-section,.privacy-consent-banner'));
        const visible = new Set<Element>();
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { if (entry.isIntersecting)
                visible.add(entry.target);
            else
                visible.delete(entry.target); });
            setContactVisible(visible.size > 0);
        });
        targets.forEach(target => observer.observe(target));
        return () => observer.disconnect();
    }, [path]);
    if (!site.whatsapp || path.startsWith('/blog'))
        return null;
    const context = path.startsWith('/projetos/') ? `o projeto ${path.split('/').pop()?.replace(/-/g, ' ')}` : path === '/sobre' ? 'a página Sobre' : 'seu trabalho';
    return contactVisible ? null : <WhatsAppLink context={context} className="whatsapp-floating" label="WhatsApp"/>;
}
