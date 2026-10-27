'use client';

import {useEffect,useState} from 'react';
import {journalCopy} from '@/content/journal-i18n';
import {useJournalPreferences} from './journal-preferences';

export function JournalShare({url, variant = 'end'}: {url?: string; variant?: 'compact' | 'end'}) {
  const {locale} = useJournalPreferences();
  const copy = journalCopy[locale];
  const [status, setStatus] = useState<'copied' | 'error' | null>(null);
  const [shareUrl,setShareUrl]=useState(url||'');
  useEffect(()=>{setShareUrl(url||`${window.location.origin}${window.location.pathname}`)},[url]);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl || `${window.location.origin}${window.location.pathname}`);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  }
  const options = shareUrl && <>
    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label={`${copy.shareLinkedIn} (${locale === 'en' ? 'opens in a new tab' : 'abre em nova aba'})`}>{copy.shareLinkedIn} ↗</a>
    <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label={`${copy.shareWhatsApp} (${locale === 'en' ? 'opens in a new tab' : 'abre em nova aba'})`}>{copy.shareWhatsApp} ↗</a>
  </>;
  const feedback = <span role="status" aria-live="polite">{status === 'copied' ? copy.copied : status === 'error' ? copy.copyError : ''}</span>;

  if (variant === 'compact') return <div className="journal-share journal-share-compact">
    <details>
      <summary><span>{copy.share}</span><span aria-hidden="true">↗</span></summary>
      <div className="journal-share-options">
        <button type="button" onClick={copyLink}>{copy.copy}</button>
        {options}
        {feedback}
      </div>
    </details>
  </div>;

  return <div className="journal-share journal-share-end">
    <span className="journal-share-label">{copy.shareEnd}</span>
    <button type="button" onClick={copyLink}>{copy.copy} ↗</button>
    {options}
    {feedback}
  </div>;
}
