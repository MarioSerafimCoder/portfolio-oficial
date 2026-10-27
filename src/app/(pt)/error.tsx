'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Link from 'next/link';
export default function ErrorPage({ reset }: {
    reset: () => void;
}) { const { i18nText, i18nHref } = useSiteTranslation(); return <main id="conteudo" className="not-found section-wrap"><span className="eyebrow">{i18nText("Algo interrompeu a leitura")}</span><h1>{i18nText("Vamos tentar")}<br />{i18nText("mais uma vez.")}</h1><div className="error-actions"><button className="pill" onClick={reset}>{i18nText("Tentar novamente \u2197")}</button><Link className="text-link" href={i18nHref("/")}>{i18nText("Voltar ao in\u00EDcio")}</Link><Link className="text-link" href={i18nHref("/contato")}>{i18nText("Entrar em contato \u2197")}</Link></div></main>; }
