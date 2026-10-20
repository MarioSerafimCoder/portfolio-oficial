'use client';

import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {usePathname} from 'next/navigation';

export type JournalLocale = 'pt' | 'en';
type Preferences = {locale: JournalLocale; setLocale: (locale: JournalLocale) => void; query: string; setQuery: (query: string) => void};
const JournalPreferencesContext = createContext<Preferences | null>(null);

export function JournalPreferencesProvider({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const isJournal = pathname === '/blog' || pathname.startsWith('/blog/');
  const [locale, setLocaleState] = useState<JournalLocale>('pt');
  const [query, setQuery] = useState('');

  useEffect(() => {
    try { if (localStorage.getItem('ms-journal-lang') === 'en') setLocaleState('en'); } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = isJournal && locale === 'en' ? 'en' : 'pt-BR';
  }, [isJournal, locale]);
  useEffect(() => {
    if (!isJournal) return;
    const syncQuery = () => setQuery(new URLSearchParams(window.location.search).get('q') || '');
    syncQuery();
    window.addEventListener('popstate', syncQuery);
    return () => window.removeEventListener('popstate', syncQuery);
  }, [isJournal, pathname]);

  function setLocale(next: JournalLocale) {
    setLocaleState(next);
    try { localStorage.setItem('ms-journal-lang', next); } catch {}
  }
  return <JournalPreferencesContext.Provider value={{locale, setLocale, query, setQuery}}>{children}</JournalPreferencesContext.Provider>;
}

export function useJournalPreferences() {
  const preferences = useContext(JournalPreferencesContext);
  if (!preferences) throw new Error('JournalPreferencesProvider ausente');
  return preferences;
}

export function SiteSkipLink() {
  const pathname = usePathname();
  const {locale} = useJournalPreferences();
  const english = (pathname === '/blog' || pathname.startsWith('/blog/')) && locale === 'en';
  return <a href="#conteudo" className="skip-link">{english ? 'Skip to content' : 'Pular para o conteúdo'}</a>;
}
