'use client';

import {useEffect,useState} from 'react';
import {journalCopy} from '@/content/journal-i18n';
import {useJournalPreferences} from './journal-preferences';

export function JournalShare({url}: {url?: string}) {
  const {locale} = useJournalPreferences();
  const copy = journalCopy[locale];
  const [status, setStatus] = useState<'copied' | 'error' | null>(null);
  const [shareUrl,setShareUrl]=useState(url||'');
  useEffect(()=>{setShareUrl(url||`${window.location.origin}${window.location.pathname}`)},[url]);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url || `${window.location.origin}${window.location.pathname}`);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  }
  return <div className="journal-share">
    <button type="button" onClick={copyLink} aria-label={copy.copy}>{copy.copy} <span aria-hidden="true">↗</span></button>
    {shareUrl&&<><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label={`${copy.shareLinkedIn} (abre em nova aba)`}>{copy.shareLinkedIn} ↗</a><a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label={`${copy.shareWhatsApp} (abre em nova aba)`}>{copy.shareWhatsApp} ↗</a></>}
    <span role="status" aria-live="polite">{status === 'copied' ? copy.copied : status === 'error' ? copy.copyError : ''}</span>
  </div>;
}
