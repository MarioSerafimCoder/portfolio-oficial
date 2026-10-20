'use client';

import {useState} from 'react';
import {journalCopy} from '@/content/journal-i18n';
import {useJournalPreferences} from './journal-preferences';

export function JournalShare({url}: {url?: string}) {
  const {locale} = useJournalPreferences();
  const copy = journalCopy[locale];
  const [status, setStatus] = useState<'copied' | 'error' | null>(null);
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
    <span role="status" aria-live="polite">{status === 'copied' ? copy.copied : status === 'error' ? copy.copyError : ''}</span>
  </div>;
}
