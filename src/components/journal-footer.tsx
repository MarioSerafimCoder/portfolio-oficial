'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Link from 'next/link';
import { useJournalPreferences } from './journal-preferences';
import { journalCopy } from '@/content/journal-i18n';
import {site} from '@/content/site';
export function JournalFooter({ article = false }: {
    article?: boolean;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const { locale } = useJournalPreferences();
    const copy = journalCopy[locale];
    return <section className={`journal-footer-invitation${article ? ' is-article' : ''}`} aria-labelledby="journal-contact-title">
    <div className="journal-footer-copy">
      <span className="journal-footer-kicker">{copy.footerContactKicker}</span>
      <h2 id="journal-contact-title">{i18nText(article ? copy.footerArticleTitle : copy.footerIndexTitle)}</h2>
      <p>{i18nText(article ? copy.footerArticleText : copy.footerIndexText)}</p>
    </div>
    <div className="journal-footer-actions">
      <Link href={i18nHref("/contato")} className="journal-footer-cta">{i18nText(copy.contact)}</Link>
      <a href={`mailto:${site.email}`} className="journal-footer-email">{site.email}</a>
    </div>
  </section>;
}
