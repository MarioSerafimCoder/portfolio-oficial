import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact';
import { site } from '@/content/site';
import { BookingLink, WhatsAppLink } from '@/components/whatsapp-link';
export const metadata: Metadata = { title: 'Contato para identidade visual e direção de arte', description: 'Converse com Mário Serafim sobre identidade visual, branding, direção de arte ou uma experiência digital.', alternates: { canonical: '/contato' }, openGraph: { title: 'Contato — Mário Serafim', description: 'Vamos conversar sobre seu próximo projeto.', url: '/contato' } };
export default function Contact({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) { const { i18nText, i18nHref } = createTranslator(locale); return <main id="conteudo" className="contact-page"><section className="page-heading section-wrap"><span className="eyebrow">{i18nText("Contato")}</span><h1>{i18nText("Toda marca tem um")}<br /><em>{i18nText("pr\u00F3ximo cap\u00EDtulo.")}</em></h1></section><section id="contato" className="contact-layout section-wrap"><div className="contact-aside"><h2>{i18nText("Uma ideia ainda n\u00E3o precisa")}<br />{i18nText("ter todas as respostas.")}</h2><p>{i18nText("Conte um pouco sobre o que voc\u00EA est\u00E1 construindo. O resto come\u00E7a com uma conversa.")}</p><div><span className="eyebrow">{i18nText("Direto, se preferir")}</span><a className="text-link" href={i18nHref(`mailto:${site.email}`)}>{i18nText(site.email)}{i18nText(" \u2197")}</a><WhatsAppLink context="a página de contato" className="text-link"/><BookingLink className="text-link"/></div><span className="contact-place">{i18nText("De Fortaleza, para boas ideias.")}</span></div><ContactForm /></section></main>; }
