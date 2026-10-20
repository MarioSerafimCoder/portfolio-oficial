'use client';

import {usePathname, useRouter} from 'next/navigation';
import {useJournalPreferences} from './journal-preferences';
import {journalCopy} from '@/content/journal-i18n';

export function JournalHeaderTools() {
  const pathname = usePathname();
  const router = useRouter();
  const {locale, setLocale, query, setQuery} = useJournalPreferences();
  const copy = journalCopy[locale];

  function changeQuery(value: string) {
    setQuery(value);
    if (pathname === '/blog') {
      const next = value.trim() ? `/blog?q=${encodeURIComponent(value)}` : '/blog';
      window.history.replaceState(null, '', next);
    }
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pathname === '/blog') {
      document.getElementById('journal-index-title')?.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    } else {
      router.push(query.trim() ? `/blog?q=${encodeURIComponent(query.trim())}` : '/blog');
    }
  }
  return <div className="journal-header-tools" aria-label={locale === 'en' ? 'Pausa do café tools' : 'Ferramentas de Pausa do café'}>
    <form className="journal-header-search" role="search" action="/blog" onSubmit={submit}>
      <label className="sr-only" htmlFor="journal-search">{copy.search}</label>
      <input id="journal-search" type="search" name="q" value={query} onChange={event => changeQuery(event.target.value)} placeholder={copy.search} autoComplete="off"/>
      <button type="submit" aria-label={copy.searchButton} title={copy.searchButton}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
    </form>
    <button type="button" className="journal-language-toggle" aria-label={`PT / EN — ${copy.language}`} title={copy.language} onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')}><span className={locale === 'pt' ? 'is-active' : undefined}>PT</span><span aria-hidden="true">/</span><span className={locale === 'en' ? 'is-active' : undefined}>EN</span></button>
  </div>;
}
