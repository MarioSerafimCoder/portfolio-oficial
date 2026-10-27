'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Link from 'next/link';
import { useJournalPreferences } from './journal-preferences';
import { journalCopy } from '@/content/journal-i18n';
export function JournalFooter({ article = false }: {
    article?: boolean;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const { locale } = useJournalPreferences();
    const copy = journalCopy[locale];
    return <section className={`journal-footer-invitation${article ? ' is-article' : ''}`} aria-labelledby="journal-contact-title">
    <h2 id="journal-contact-title">{i18nText(article ? copy.footerArticleTitle : copy.footerIndexTitle)}</h2>
    <p>{i18nText(article ? copy.footerArticleText : copy.footerIndexText)}</p>
    <Link href={i18nHref("/contato")} className="text-link">{i18nText(copy.contact)}</Link>
  </section>;
}
