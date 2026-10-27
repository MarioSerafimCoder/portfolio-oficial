'use client';

import {useEffect, useId, useState} from 'react';
import Link from 'next/link';
import {useJournalPreferences} from './journal-preferences';
import {journalCopy} from '@/content/journal-i18n';
import {trackEvent} from '@/lib/analytics';

const legacyEndpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT?.trim();

export function Newsletter({variant = 'legacy'}: {variant?: 'legacy' | 'article'}) {
  return variant === 'article' ? <ArticleNewsletter /> : <LegacyNewsletter />;
}

function ArticleNewsletter() {
  const {locale} = useJournalPreferences();
  const copy = journalCopy[locale];
  const id = useId().replace(/:/g, '');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'checking' | 'ready' | 'unavailable' | 'sending' | 'pending' | 'error' | 'duplicate'>('checking');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/newsletter', {cache: 'no-store', signal: controller.signal})
      .then(async response => response.ok ? response.json() : {available: false})
      .then(result => setState(result?.available === true ? 'ready' : 'unavailable'))
      .catch(() => setState('unavailable'));
    return () => controller.abort();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state !== 'ready' || !consent || website.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState(website.trim() ? 'error' : state === 'ready' ? 'error' : 'unavailable');
      return;
    }
    setState('sending');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email.trim(), consent: true, website}),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 202 && result?.status === 'pending_confirmation') {
        setState('pending');
        trackEvent('newsletter_signup');
      } else if (response.status === 409) {
        setState('duplicate');
      } else if (response.status === 503 && result?.code === 'not_configured') {
        setState('unavailable');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  return <section className="journal-newsletter journal-newsletter-article section-wrap" aria-labelledby="newsletter-title">
    <div className="journal-newsletter-copy">
      <span className="eyebrow">{copy?.newsletterEyebrow}</span>
      <h2 id="newsletter-title">{copy?.newsletterTitle}</h2>
      <p className="journal-newsletter-description">{copy?.newsletterDescription}</p>
      {copy?.newsletterClosing && <p className="journal-newsletter-closing">{copy.newsletterClosing}</p>}
    </div>
    <div className="journal-newsletter-action">
      {state === 'checking' && <p className="newsletter-feedback" role="status">{copy?.newsletterChecking}</p>}
      {state === 'unavailable' && <p className="newsletter-feedback" role="status">{copy?.newsletterUnavailable}</p>}
      {state === 'pending' && <p className="newsletter-feedback" role="status">{copy?.newsletterPending}</p>}
      {state === 'duplicate' && <div className="journal-newsletter-result"><p className="newsletter-feedback" role="status">{copy.newsletterDuplicate}</p><button type="button" className="journal-newsletter-retry" onClick={() => {setEmail('');setState('ready');}}>{copy.newsletterTryAnother}</button></div>}
      {(state === 'ready' || state === 'sending' || state === 'error') && <form className="journal-newsletter-form" onSubmit={submit}>
      <label className="journal-newsletter-email" htmlFor={`${id}-email`}>
        <span className="sr-only">{copy?.newsletterEmail}</span>
        <input id={`${id}-email`} name="email" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" placeholder={copy?.newsletterEmail} required maxLength={254} aria-invalid={state === 'error'} />
      </label>
      <label className="contact-honeypot" aria-hidden="true" htmlFor={`${id}-website`}>Deixe este campo vazio<input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label>
      <button className="journal-newsletter-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? copy?.newsletterSending : copy?.newsletterButton} <span aria-hidden="true">↗</span></button>
      <label className="newsletter-consent" htmlFor={`${id}-consent`}>
        <input id={`${id}-consent`} type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required />
        <span>{copy?.newsletterConsent} <Link href="/privacidade">{copy?.newsletterPrivacy}</Link>.</span>
      </label>
      <p className="journal-newsletter-promise">{copy?.newsletterOnly}</p>
      {state === 'error' && <p className="newsletter-feedback" role="status">{copy?.newsletterError}</p>}
      </form>}
    </div>
  </section>;
}

function LegacyNewsletter() {
  const {locale} = useJournalPreferences();
  const id = useId().replace(/:/g, '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  if (!legacyEndpoint || locale !== 'pt') return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!legacyEndpoint || website.trim() || !consent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {setState('error');return;}
    setState('sending');
    try {
      const response = await fetch(legacyEndpoint, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: name.trim(), email: email.trim(), consent: true, source: 'portfolio-diario'})});
      if (!response.ok) throw new Error('newsletter');
      setState('success');
      trackEvent('newsletter_signup');
    } catch {setState('error');}
  }

  return <section className="journal-newsletter section-wrap" aria-labelledby="newsletter-title"><span className="eyebrow">Correspondência</span><h2 id="newsletter-title">Uma nota na sua caixa de entrada.</h2><p>Quando houver um texto novo, posso te avisar por e-mail. Sem frequência prometida.</p>{state === 'success' ? <p className="newsletter-feedback" role="status">Inscrição recebida. Obrigado por acompanhar Pausa do café.</p> : <form onSubmit={submit} noValidate>
    <label htmlFor={`${id}-name`}>Nome <span className="optional">opcional</span><input id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} autoComplete="name" maxLength={100} /></label>
    <label htmlFor={`${id}-email`}>E-mail<input id={`${id}-email`} type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required aria-invalid={state === 'error' && !email.includes('@')} /></label>
    <label className="contact-honeypot" aria-hidden="true" htmlFor={`${id}-website`}>Deixe este campo vazio<input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label>
    <label className="newsletter-consent" htmlFor={`${id}-consent`}><input id={`${id}-consent`} type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required /><span>Aceito receber os textos por e-mail e li a <Link href="/privacidade">política de privacidade</Link>.</span></label>
    <button className="pill filled" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : 'Inscrever-me ↗'}</button>
    <p className="newsletter-feedback" role="status" aria-live="polite">{state === 'error' ? 'Confira o e-mail e o consentimento. Se estiverem corretos, tente novamente mais tarde.' : ''}</p>
  </form>}</section>;
}
