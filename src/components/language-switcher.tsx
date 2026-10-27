'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {languagePeer} from '@/i18n/routes';
import {useJournalPreferences} from './journal-preferences';
export function LanguageSwitcher(){
 const pathname=usePathname();const {locale}=useJournalPreferences();const next=locale==='pt'?'en':'pt';const destination=languagePeer(pathname,next);
 return destination?<Link className="journal-language-toggle site-language-toggle" href={destination} hrefLang={next==='en'?'en':'pt-BR'} aria-label={next==='en'?'Read this page in English':'Ler esta página em português'}><span className={locale==='pt'?'is-active':undefined}>PT</span><span aria-hidden="true">/</span><span className={locale==='en'?'is-active':undefined}>EN</span></Link>:<span className="journal-language-toggle site-language-toggle" title="A tradução desta página ainda não está disponível" aria-label="Português; tradução inglesa ainda não disponível">PT</span>;
}
