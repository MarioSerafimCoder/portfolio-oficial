'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Image from 'next/image';
import { site } from '@/content/site';
import { journalCopy, formatJournalDateLocale } from '@/content/journal-i18n';
import { useJournalPreferences } from './journal-preferences';
import { JournalShare } from './journal-share';

type Props = {
    photo?: string;
    date?: string;
    readingTime?: number;
    url?: string;
    demo?: boolean;
};

function Avatar({ photo, demo }: { photo?: string; demo: boolean }) {
    const { i18nText } = useSiteTranslation();
    if (photo && !demo)
        return <Image className="journal-author-avatar" src={photo} alt={i18nText("Retrato de Mário Serafim")} width={56} height={56}/>;
    return <span className="journal-author-avatar journal-author-avatar-placeholder" aria-hidden="true">{i18nText(demo ? 'PC' : 'MS')}</span>;
}

export function JournalAuthorSignature({ photo, date, readingTime, url, demo = false }: Props) {
    const { i18nText } = useSiteTranslation();
    const { locale } = useJournalPreferences();
    const copy = journalCopy[locale];
    const name = demo ? copy.demoAuthor : site.name;
    const role = demo ? copy.previewAuthorRole : copy.authorRole;

    return <div className="journal-author-signature journal-author-signature-compact">
      <Avatar photo={photo} demo={demo}/>
      <div className="journal-author-identity">
        <strong>{i18nText(name)}</strong>
        <span>{i18nText(role)}</span>
        <div className="journal-author-meta">
          {i18nText(date && <time dateTime={date}>{i18nText(formatJournalDateLocale(date, locale, true))}</time>)}
          {i18nText(readingTime !== undefined && <span>{i18nText(copy.reading(readingTime))}</span>)}
        </div>
      </div>
      <JournalShare variant="compact" url={url}/>
    </div>;
}
