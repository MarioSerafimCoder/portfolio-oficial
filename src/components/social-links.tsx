'use client';

import {socialLinks} from '@/lib/site-links';
import {trackEvent} from '@/lib/analytics';

function SocialIcon({name}: {name: string}) {
  if (name === 'Instagram') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/><circle cx="17.5" cy="6.6" r="1" fill="currentColor"/></svg>;
  if (name === 'Behance') return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 7.5h6.2c3.2 0 4.2 3.4 1.8 4.6 3.4 1.2 2.2 5.4-1.9 5.4H3.5v-10Zm0 4.3h5.8m-5.8 0v4.1m11.6-8.7h6m-6.6 6.5h7.1c0-3-1.2-4.4-3.5-4.4-2.5 0-3.7 1.6-3.7 4s1.3 4 3.8 4c1.6 0 2.7-.6 3.3-1.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.2 8.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM3.8 10h2.8v9.4H3.8V10Zm4.8 0h2.7v1.3h.1c.4-.8 1.3-1.5 2.8-1.5 3 0 3.5 1.9 3.5 4.3v5.3h-2.8v-4.7c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6v4.8H8.6V10Z"/></svg>;
}

export function SocialLinks({variant = 'icons'}: {variant?: 'icons' | 'text'}) {
  return <div className={`social-links social-links-${variant}`}>{socialLinks.map(({name, url, key}) => <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} de Mário Serafim (abre em nova aba)`} onClick={() => trackEvent('social_click', {network: key})}>{variant === 'icons' ? <SocialIcon name={name}/> : <>{name} <span aria-hidden="true">↗</span></>}<span className="sr-only">Abre em nova aba</span></a>)}</div>;
}
