'use client';

import Link from 'next/link';
import {useJournalPreferences} from './journal-preferences';
import {journalCopy} from '@/content/journal-i18n';

export function JournalFooter({article = false}: {article?: boolean}) {
  const {locale} = useJournalPreferences();
  const copy = journalCopy[locale];
  return <section className={`journal-footer-invitation${article ? ' is-article' : ''}`} aria-labelledby="journal-contact-title">
    <h2 id="journal-contact-title">{article ? copy.footerArticleTitle : copy.footerIndexTitle}</h2>
    <p>{article ? copy.footerArticleText : copy.footerIndexText}</p>
    <Link href="/contato" className="text-link">{copy.contact}</Link>
  </section>;
}
