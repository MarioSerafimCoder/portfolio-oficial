import {createTranslator} from '@/i18n/translate';
import type {SiteLocale} from '@/i18n/routes';
import Link from 'next/link';
export default function NotFound({ locale = "pt" }: {
    locale?: SiteLocale;
} = {}) { const { i18nText, i18nHref } = createTranslator(locale); return <main id="conteudo" className="not-found section-wrap"><span className="eyebrow">{i18nText("404 / Um caminho em aberto")}</span><h1>{i18nText("Essa p\u00E1gina")}<br />{i18nText("ficou pelo caminho.")}</h1><div className="error-actions"><Link className="pill" href={i18nHref("/")}>{i18nText("Voltar ao in\u00EDcio \u2197")}</Link><Link className="text-link" href={i18nHref("/contato")}>{i18nText("Entrar em contato \u2197")}</Link></div></main>; }
