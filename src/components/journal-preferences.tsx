'use client';

import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {languagePeer,localeFromPath,originalPath} from '@/i18n/routes';

export type JournalLocale = 'pt' | 'en';
type Preferences = {locale: JournalLocale; setLocale: (locale: JournalLocale) => void; query: string; setQuery: (query: string) => void};
const JournalPreferencesContext = createContext<Preferences | null>(null);

export function JournalPreferencesProvider({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const router=useRouter();
  const path=originalPath(pathname);
  const isJournal = path === '/blog' || path.startsWith('/blog/');
  const locale=localeFromPath(pathname);
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR';
  }, [isJournal, locale]);
  useEffect(() => {
    if (!isJournal) return;
    const syncQuery = () => setQuery(new URLSearchParams(window.location.search).get('q') || '');
    syncQuery();
    window.addEventListener('popstate', syncQuery);
    return () => window.removeEventListener('popstate', syncQuery);
  }, [isJournal, pathname]);

  function setLocale(next: JournalLocale) {
    const destination=languagePeer(pathname,next);
    if(!destination)return;
    try { localStorage.setItem('ms-site-lang', next); } catch {}
    router.push(destination+window.location.search+window.location.hash);
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
  const english = locale === 'en';
  return <a href="#conteudo" className="skip-link">{english ? 'Skip to content' : 'Pular para o conteúdo'}</a>;
}
