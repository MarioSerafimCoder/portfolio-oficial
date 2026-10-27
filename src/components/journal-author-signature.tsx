'use client';

import Image from 'next/image';
import Link from 'next/link';
import {site} from '@/content/site';
import {journalCopy, formatJournalDateLocale} from '@/content/journal-i18n';
import {useJournalPreferences} from './journal-preferences';
import {JournalShare} from './journal-share';

type Props = {
  variant: 'compact' | 'expanded';
  photo?: string;
  date?: string;
  readingTime?: number;
  url?: string;
  demo?: boolean;
};

function Avatar({photo, demo}: {photo?: string; demo: boolean}) {
  if (photo && !demo) return <Image className="journal-author-avatar" src={photo} alt="Retrato de Mário Serafim" width={56} height={56} />;
  return <span className="journal-author-avatar journal-author-avatar-placeholder" aria-hidden="true">{demo ? 'PC' : 'MS'}</span>;
}

export function JournalAuthorSignature({variant, photo, date, readingTime, url, demo = false}: Props) {
  const {locale} = useJournalPreferences();
  const copy = journalCopy[locale];
  const name = demo ? copy.demoAuthor : site.name;
  const role = demo ? copy.previewAuthorRole : copy.authorRole;

  if (variant === 'compact') return <div className="journal-author-signature journal-author-signature-compact">
    <Avatar photo={photo} demo={demo} />
    <div className="journal-author-identity">
      <strong>{name}</strong>
      <span>{role}</span>
      <div className="journal-author-meta">
        {date && <time dateTime={date}>{formatJournalDateLocale(date, locale, true)}</time>}
        {readingTime !== undefined && <span>{copy.reading(readingTime)}</span>}
      </div>
    </div>
    <JournalShare variant="compact" url={url} />
  </div>;

  return <aside className="journal-author-signature journal-author-signature-expanded" aria-label={locale === 'en' ? 'About the author' : 'Sobre o autor'}>
    <Avatar photo={photo} demo={demo} />
    <div className="journal-author-expanded-copy">
      <span className="journal-author-kicker">{copy.authorKicker}</span>
      <strong>{name}</strong>
      <span className="journal-author-role">{role}</span>
      <p>{demo ? copy.previewAuthorBio : copy.authorBio}</p>
      {!demo && <div className="journal-author-links">
        <Link href="/">{copy.authorPortfolio} ↗</Link>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      </div>}
    </div>
  </aside>;
}
