'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import { useEffect, useState } from 'react';
import { journalCopy } from '@/content/journal-i18n';
import { useJournalPreferences } from './journal-preferences';
import { trackEvent } from '@/lib/analytics';

function ShareOptionIcon({ kind }: { kind: 'copy' | 'linkedin' | 'whatsapp' }) {
    if (kind === 'linkedin')
        return <svg className="journal-share-option-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="2.5" y="2.5" width="15" height="15" rx="2.5" fill="currentColor"/><path d="M6 8v6M6 6h.01M9.5 14v-6m0 2.3c0-1.3 3.5-1.5 3.5.3V14" fill="none" stroke="var(--surface)" strokeLinecap="round" strokeWidth="1.5"/></svg>;
    if (kind === 'whatsapp')
        return <svg className="journal-share-option-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M16.2 9.7a6.2 6.2 0 0 1-9.1 5.5L3.8 16l.9-3.2a6.2 6.2 0 1 1 11.5-3.1Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M7.6 7.5c.2 1.9 1.8 3.5 3.7 3.9l1-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/></svg>;
    return <svg className="journal-share-option-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="6" y="3" width="10.5" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 17H5a1.5 1.5 0 0 1-1.5-1.5V6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/></svg>;
}

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
    <a href={i18nHref(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)} target="_blank" rel="noopener noreferrer" aria-label={i18nText(`${copy.shareLinkedIn} (${locale === 'en' ? 'opens in a new tab' : 'abre em nova aba'})`)} onClick={() => trackEvent('journal_share', {method: 'linkedin'})}><ShareOptionIcon kind="linkedin"/><span>{i18nText(copy.shareLinkedIn)}</span><span className="journal-share-option-arrow" aria-hidden="true">{i18nText("\u2197")}</span></a>
    <a href={i18nHref(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`)} target="_blank" rel="noopener noreferrer" aria-label={i18nText(`${copy.shareWhatsApp} (${locale === 'en' ? 'opens in a new tab' : 'abre em nova aba'})`)} onClick={() => trackEvent('journal_share', {method: 'whatsapp'})}><ShareOptionIcon kind="whatsapp"/><span>{i18nText(copy.shareWhatsApp)}</span><span className="journal-share-option-arrow" aria-hidden="true">{i18nText("\u2197")}</span></a>
  </>;
    const feedback = <span role="status" aria-live="polite">{i18nText(status === 'copied' ? copy.copied : status === 'error' ? copy.copyError : '')}</span>;
    if (variant === 'compact')
        return <div className="journal-share journal-share-compact">
    <details>
      <summary><span>{i18nText(copy.share)}</span><span aria-hidden="true">{i18nText("\u2197")}</span></summary>
      <div className="journal-share-options">
        <button type="button" onClick={copyLink}><ShareOptionIcon kind="copy"/><span>{i18nText(copy.copy)}</span></button>
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
