'use client';
import {LanguageSwitcher} from './language-switcher';
import {originalPath} from '@/i18n/routes';
import {useSiteTranslation} from '@/i18n/use-translation';
import { usePathname, useRouter } from 'next/navigation';
import { useJournalPreferences } from './journal-preferences';
import { journalCopy } from '@/content/journal-i18n';
import { trackEvent } from '@/lib/analytics';
export function JournalHeaderTools() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const pathname = originalPath(usePathname());
    const router = useRouter();
    const { locale, setLocale, query, setQuery } = useJournalPreferences();
    const copy = journalCopy[locale];
    function changeQuery(value: string) {
        setQuery(value);
        if (pathname === '/blog') {
            const next = value.trim() ? `/blog?q=${encodeURIComponent(value)}` : '/blog';
            window.history.replaceState(null, '', i18nHref(next));
        }
    }
    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        trackEvent('journal_search', {has_query: query.trim() ? 'true' : 'false'});
        if (pathname === '/blog') {
            document.getElementById('journal-index-title')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        }
        else {
            router.push(i18nHref(query.trim() ? `/blog?q=${encodeURIComponent(query.trim())}` : '/blog'));
        }
    }
    return <div className="journal-header-tools" aria-label={i18nText(locale === 'en' ? 'Pausa do café tools' : 'Ferramentas de Pausa do café')}>
    <form className="journal-header-search" role="search" action={i18nHref("/blog")} onSubmit={submit}>
      <label className="sr-only" htmlFor="journal-search">{i18nText(copy.search)}</label>
      <input id="journal-search" type="search" name="q" value={query} onChange={event => changeQuery(event.target.value)} placeholder={i18nText(copy.search)} autoComplete="off"/>
      <button type="submit" aria-label={i18nText(copy.searchButton)} title={i18nText(copy.searchButton)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
    </form>
    <LanguageSwitcher/>
  </div>;
}
