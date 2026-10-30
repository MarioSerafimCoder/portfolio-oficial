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
};

function Avatar({ photo }: { photo?: string }) {
    const { i18nText } = useSiteTranslation();
    if (photo)
        return <Image className="journal-author-avatar" src={photo} alt={i18nText("Retrato de Mário Serafim")} width={56} height={56}/>;
    return <span className="journal-author-avatar journal-author-avatar-placeholder" aria-hidden="true">{i18nText('MS')}</span>;
}

export function JournalAuthorSignature({ photo, date, readingTime, url }: Props) {
    const { i18nText } = useSiteTranslation();
    const { locale } = useJournalPreferences();
    const copy = journalCopy[locale];
    const name = site.name;
    const role = copy.authorRole;
    const [authorRole, authorLocation] = role.split(' · ', 2);

    return <div className="journal-author-signature journal-author-signature-compact">
      <span className="journal-author-kicker">{i18nText(copy.authorKicker)}</span>
      <div className="journal-author-profile">
        <Avatar photo={photo}/>
        <div className="journal-author-identity">
          <strong>{i18nText(name)}</strong>
          <span>{i18nText(authorRole)}</span>
          {i18nText(authorLocation && <span>{i18nText(authorLocation)}</span>)}
        </div>
      </div>
      <dl className="journal-author-meta">
        {i18nText(date && <div><dt>{i18nText(copy.publishedLabel)}</dt><dd><time dateTime={date}>{i18nText(formatJournalDateLocale(date, locale, true))}</time></dd></div>)}
        {i18nText(readingTime !== undefined && <div><dt>{i18nText(copy.readingLabel)}</dt><dd>{i18nText(copy.readingValue(readingTime))}</dd></div>)}
      </dl>
      <JournalShare variant="compact" url={url}/>
    </div>;
}
