'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import { useEffect, useState } from 'react';
import { journalCopy } from '@/content/journal-i18n';
import { useJournalPreferences } from './journal-preferences';
import { trackEvent } from '@/lib/analytics';
export function JournalShare({ url, variant = 'end' }: {
    url?: string;
    variant?: 'compact' | 'end';
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const { locale } = useJournalPreferences();
    const copy = journalCopy[locale];
    const [status, setStatus] = useState<'copied' | 'error' | null>(null);
    const [shareUrl, setShareUrl] = useState(url || '');
    useEffect(() => { setShareUrl(url || `${window.location.origin}${window.location.pathname}`); }, [url]);
    async function copyLink() {
        trackEvent('journal_share', {method: 'copy'});
        try {
            await navigator.clipboard.writeText(shareUrl || `${window.location.origin}${window.location.pathname}`);
            setStatus('copied');
        }
        catch {
            setStatus('error');
        }
    }
    const options = shareUrl && <>
    <a href={i18nHref(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)} target="_blank" rel="noopener noreferrer" aria-label={i18nText(`${copy.shareLinkedIn} (${locale === 'en' ? 'opens in a new tab' : 'abre em nova aba'})`)} onClick={() => trackEvent('journal_share', {method: 'linkedin'})}>{i18nText(copy.shareLinkedIn)}{i18nText(" \u2197")}</a>
    <a href={i18nHref(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`)} target="_blank" rel="noopener noreferrer" aria-label={i18nText(`${copy.shareWhatsApp} (${locale === 'en' ? 'opens in a new tab' : 'abre em nova aba'})`)} onClick={() => trackEvent('journal_share', {method: 'whatsapp'})}>{i18nText(copy.shareWhatsApp)}{i18nText(" \u2197")}</a>
  </>;
    const feedback = <span role="status" aria-live="polite">{i18nText(status === 'copied' ? copy.copied : status === 'error' ? copy.copyError : '')}</span>;
    if (variant === 'compact')
        return <div className="journal-share journal-share-compact">
    <details>
      <summary><span>{i18nText(copy.share)}</span><span aria-hidden="true">{i18nText("\u2197")}</span></summary>
      <div className="journal-share-options">
        <button type="button" onClick={copyLink}>{i18nText(copy.copy)}</button>
        {i18nText(options)}
        {i18nText(feedback)}
      </div>
    </details>
  </div>;
    return <div className="journal-share journal-share-end">
    <span className="journal-share-label">{i18nText(copy.shareEnd)}</span>
    <button type="button" onClick={copyLink}>{i18nText(copy.copy)}{i18nText(" \u2197")}</button>
    {i18nText(options)}
    {i18nText(feedback)}
  </div>;
}
