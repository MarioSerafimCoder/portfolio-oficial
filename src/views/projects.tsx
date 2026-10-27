import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import { ProjectBrowser } from '@/components/projects';
export const metadata: Metadata = { title: 'Projetos de identidade visual e direção de arte', description: 'Identidade visual, branding, direção de arte e design digital por Mário Serafim, diretor de arte em Fortaleza.', alternates: { canonical: '/projetos' }, openGraph: { title: 'Projetos | Mário Serafim', description: 'Identidades visuais, direção de arte e experiências digitais.', url: '/projetos' } };
export default function Projects({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) { const { i18nText, i18nHref } = createTranslator(locale); return <main id="conteudo" className="projects-page"><div className="page-heading section-wrap"><span className="eyebrow">{i18nText("Projetos")}</span><h1>{i18nText("Cada projeto, uma boa pergunta.")}</h1><p>{i18nText("Uma seleção de identidades, campanhas e experiências que nasceram de contextos diferentes. Porque uma solução pronta pode até economizar tempo, mas dificilmente resolve o problema certo.")}</p></div><section className="section-wrap project-browser" aria-label={i18nText("Sele\u00E7\u00E3o de projetos")}><ProjectBrowser /></section></main>; }
