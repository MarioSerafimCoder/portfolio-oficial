import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import { ProjectBrowser } from '@/components/projects';
export const metadata: Metadata = { title: 'Projetos de identidade visual e direção de arte', description: 'Conheça projetos de identidade visual, branding, direção de arte e design digital de Mário Serafim.', alternates: { canonical: '/projetos' }, openGraph: { title: 'Projetos — Mário Serafim', description: 'Identidades visuais, direção de arte e experiências digitais.', url: '/projetos' } };
export default function Projects({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) { const { i18nText, i18nHref } = createTranslator(locale); return <main id="conteudo" className="projects-page"><div className="page-heading section-wrap"><span className="eyebrow">{i18nText("Projetos")}</span><h1>{i18nText("Uma ideia s\u00F3 ganha for\u00E7a")}<br />{i18nText("quando encontra ")}<em>{i18nText("express\u00E3o.")}</em></h1><p>{i18nText("Identidades, linguagens e experi\u00EAncias.")}<br />{i18nText("Uma sele\u00E7\u00E3o do meu trabalho.")}</p></div><section className="section-wrap project-browser" aria-label={i18nText("Sele\u00E7\u00E3o de projetos")}><ProjectBrowser /></section></main>; }
