'use client';

import {useEffect, useState} from 'react';
import type {JournalLocale} from './journal-preferences';
import {journalCopy} from '@/content/journal-i18n';

export function ThemeToggle({compact = false, locale = 'pt'}: {compact?: boolean; locale?: JournalLocale}) {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark'); }, []);
  function toggle() {
    const next = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    setDark(next);
    try { localStorage.setItem('ms-theme', next ? 'dark' : 'light'); } catch {}
  }
  const action = dark ? journalCopy[locale].themeLight : journalCopy[locale].themeDark;
  const visible = dark ? (locale === 'en' ? 'Dark' : 'Escuro') : (locale === 'en' ? 'Light' : 'Claro');
  const label = compact ? action : `${visible} · ${action}`;
  return <button type="button" className={`theme-toggle${compact ? ' journal-header-theme' : ''}`} aria-label={label} title={compact ? label : undefined} aria-pressed={dark} onClick={toggle}><span className="theme-orbit" aria-hidden="true"/>{!compact && <span>{visible}</span>}</button>;
}
