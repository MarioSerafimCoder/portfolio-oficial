import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Newsletter } from '@/components/newsletter';
// TODO(Mário): produzir e aprovar o arquivo do checklist antes de disponibilizar download e navegação.
export const metadata: Metadata = { title: 'Materiais em preparação', description: 'Material de apoio sobre identidade visual em preparação por Mário Serafim.', robots: { index: false, follow: true }, alternates: { canonical: '/materiais' } };
export default function Materials({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) { const { i18nText, i18nHref } = createTranslator(locale); return <main id="conteudo" className="materials-page"><section className="section-wrap materials-intro"><span className="eyebrow">{i18nText("Materiais")}</span><h1>{i18nText("Checklist de identidade visual:")}<br /><em>{i18nText("sua marca est\u00E1 pronta?")}</em></h1><p>{i18nText("Estou preparando este material. Enquanto ele n\u00E3o est\u00E1 dispon\u00EDvel, voc\u00EA pode conhecer os projetos ou acompanhar os textos de Pausa do caf\u00E9.")}</p><div><Link className="pill" href={i18nHref("/projetos")}>{i18nText("Ver projetos \u2197")}</Link><Link className="text-link" href={i18nHref("/blog")}>{i18nText("Ir \u00E0 Pausa do caf\u00E9 \u2197")}</Link></div></section><Newsletter /></main>; }
