'use client';

import {useEffect, useRef, useState} from 'react';
import type {JournalLocale} from './journal-preferences';
import {journalCopy} from '@/content/journal-i18n';

export function ThemeToggle({compact = false, locale = 'pt'}: {compact?: boolean; locale?: JournalLocale}) {
  const [dark, setDark] = useState(false);
  const transitionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark'); }, []);
  useEffect(()=>()=>{if(transitionTimer.current)clearTimeout(transitionTimer.current);document.documentElement.classList.remove('theme-changing')},[]);
  function toggle() {
    if(transitionTimer.current)clearTimeout(transitionTimer.current);
    document.documentElement.classList.add('theme-changing');
    transitionTimer.current=setTimeout(()=>document.documentElement.classList.remove('theme-changing'),240);
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
