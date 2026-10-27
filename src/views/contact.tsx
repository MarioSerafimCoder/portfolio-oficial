import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact';
import { site } from '@/content/site';
import { BookingLink, WhatsAppLink } from '@/components/whatsapp-link';
export const metadata: Metadata = { title: 'Contato para identidade visual e direção de arte', description: 'Fale com Mário Serafim, diretor de arte em Fortaleza, sobre identidade visual, branding, campanhas ou projetos digitais.', alternates: { canonical: '/contato' }, openGraph: { title: 'Contato | Mário Serafim', description: 'Vamos conversar sobre seu próximo projeto.', url: '/contato' } };
export default function Contact({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) { const { i18nText, i18nHref } = createTranslator(locale); return <main id="conteudo" className="contact-page"><section className="page-heading section-wrap"><span className="eyebrow">{i18nText("Contato")}</span><h1>{i18nText("Tem uma ideia que não sai da cabeça?")}</h1></section><section id="contato" className="contact-layout section-wrap"><div className="contact-aside"><h2>{i18nText("Não precisa chegar com um briefing") }<br />{i18nText("de 40 páginas.")}</h2><p>{i18nText("Pode ser uma marca começando, uma identidade precisando mudar ou um projeto que ainda está meio bagunçado. A gente conversa.")}</p><div><span className="eyebrow">{i18nText("Direto, se preferir")}</span><a className="text-link" href={i18nHref(`mailto:${site.email}`)}>{i18nText(site.email)}{i18nText(" \u2197")}</a><WhatsAppLink context="a página de contato" className="text-link" label="Me conta sua ideia"/><BookingLink className="text-link"/></div><span className="contact-place">{i18nText("De Fortaleza, para boas ideias.")}</span></div><ContactForm /></section></main>; }
