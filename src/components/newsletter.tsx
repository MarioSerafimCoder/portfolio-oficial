'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { useJournalPreferences } from './journal-preferences';
import { journalCopy } from '@/content/journal-i18n';
import { trackEvent } from '@/lib/analytics';
const legacyEndpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT?.trim();
export function Newsletter({ variant = 'legacy' }: {
    variant?: 'legacy' | 'home' | 'article';
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    return variant === 'home' || variant === 'article' ? <ArticleNewsletter variant={variant} /> : <LegacyNewsletter />;
}
function ArticleNewsletter({variant}: {variant: 'home' | 'article'}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    const { locale } = useJournalPreferences();
    const copy = journalCopy[locale];
    const id = useId().replace(/:/g, '');
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [website, setWebsite] = useState('');
    const [state, setState] = useState<'checking' | 'ready' | 'unavailable' | 'sending' | 'pending' | 'validation' | 'invalid' | 'error' | 'duplicate'>('checking');
    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/newsletter', { cache: 'no-store', signal: controller.signal })
            .then(async (response) => response.ok ? response.json() : { available: false })
            .then(result => setState(result?.available === true ? 'ready' : 'unavailable'))
            .catch(() => setState('unavailable'));
        return () => controller.abort();
    }, []);
    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setState('invalid'); return; }
        if (!consent) { setState('validation'); return; }
        if (website.trim()) { setState('error'); return; }
        if (state !== 'ready' && state !== 'invalid' && state !== 'validation' && state !== 'error') return;
        setState('sending');
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), consent: true, website }),
            });
            const result = await response.json().catch(() => ({}));
            if (response.status === 202 && result?.status === 'pending_confirmation') {
                setState('pending');
            }
            else if (response.status === 409) {
                setState('duplicate');
            }
            else if (response.status === 503 && result?.code === 'not_configured') {
                setState('unavailable');
            }
            else {
                setState('error');
            }
        }
        catch {
            setState('error');
        }
    }
    return <section className={`journal-newsletter journal-newsletter-article journal-newsletter-${variant} section-wrap`} aria-labelledby={`newsletter-title-${id}`}>
    <div className="journal-newsletter-copy">
      <span className="eyebrow">{i18nText(copy?.newsletterEyebrow)}</span>
      <h2 id={`newsletter-title-${id}`}>{i18nText(copy?.newsletterTitle)}</h2>
      <p className="journal-newsletter-description">{i18nText(copy?.newsletterDescription)}</p>
    </div>
    <div className="journal-newsletter-action">
      {i18nText(state === 'checking' && <p className="newsletter-feedback" role="status">{i18nText(copy?.newsletterChecking)}</p>)}
      {i18nText(state === 'unavailable' && <p className="newsletter-feedback" role="status">{i18nText(copy?.newsletterUnavailable)}</p>)}
      {i18nText(state === 'pending' && <p className="newsletter-feedback" role="status">{i18nText(copy?.newsletterPending)}</p>)}
      {i18nText(state === 'duplicate' && <div className="journal-newsletter-result"><p className="newsletter-feedback" role="status">{i18nText(copy.newsletterDuplicate)}</p><button type="button" className="journal-newsletter-retry" onClick={() => { setEmail(''); setState('ready'); }}>{i18nText(copy.newsletterTryAnother)}</button></div>)}
      {i18nText(state !== 'pending' && state !== 'duplicate' && <form className="journal-newsletter-form" onSubmit={submit} noValidate>
      <label className="journal-newsletter-email" htmlFor={`${id}-email`}>
        <span className="sr-only">{i18nText(copy?.newsletterEmail)}</span>
        <input id={`${id}-email`} name="email" type="email" value={email} onChange={event => {setEmail(event.target.value); if (state === 'invalid' || state === 'validation' || state === 'error') setState('ready');}} autoComplete="email" placeholder={i18nText(copy?.newsletterEmail)} required maxLength={254} aria-invalid={state === 'invalid'} disabled={state === 'unavailable' || state === 'sending'}/>
      </label>
      <label className="contact-honeypot" aria-hidden="true" htmlFor={`${id}-website`}>{i18nText("Deixe este campo vazio")}<input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)}/></label>
      <button className="journal-newsletter-submit" type="submit" disabled={state !== 'ready' && state !== 'invalid' && state !== 'validation' && state !== 'error'}>{i18nText(state === 'sending' ? copy?.newsletterSending : copy?.newsletterButton)} <span aria-hidden="true">{i18nText("\u2197")}</span></button>
      <label className="newsletter-consent" htmlFor={`${id}-consent`}>
        <input id={`${id}-consent`} type="checkbox" checked={consent} onChange={event => {setConsent(event.target.checked); if (state === 'validation' || state === 'invalid') setState('ready');}} required aria-invalid={state === 'validation'} disabled={state === 'unavailable' || state === 'sending'}/>
        <span>{i18nText(copy?.newsletterConsent)} <Link href={i18nHref("/privacidade")}>{i18nText(copy?.newsletterPrivacy)}</Link>{i18nText(".")}</span>
      </label>
      <p className="journal-newsletter-promise">{i18nText(copy?.newsletterOnly)}</p>
      {i18nText(state === 'invalid' && <p className="newsletter-feedback" role="status">{i18nText(copy.newsletterInvalidEmail)}</p>)}
      {i18nText(state === 'validation' && <p className="newsletter-feedback" role="status">{i18nText(copy.newsletterValidation)}</p>)}
      {i18nText(state === 'error' && <p className="newsletter-feedback" role="status">{i18nText(copy?.newsletterError)}</p>)}
      </form>)}
    </div>
  </section>;
}
function LegacyNewsletter() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const { locale } = useJournalPreferences();
    const id = useId().replace(/:/g, '');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [website, setWebsite] = useState('');
    const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    if (!legacyEndpoint)
        return null;
    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!legacyEndpoint || website.trim() || !consent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setState('error');
            return;
        }
        setState('sending');
        try {
            const response = await fetch(legacyEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), email: email.trim(), consent: true, source: 'portfolio-diario' }) });
            if (!response.ok)
                throw new Error('newsletter');
            setState('success');
            trackEvent('newsletter_signup');
        }
        catch {
            setState('error');
        }
    }
    return <section className="journal-newsletter section-wrap" aria-labelledby="newsletter-title"><span className="eyebrow">{i18nText("Correspond\u00EAncia")}</span><h2 id="newsletter-title">{i18nText("Uma nota na sua caixa de entrada.")}</h2><p>{i18nText("Quando houver um texto novo, posso te avisar por e-mail. Sem frequ\u00EAncia prometida.")}</p>{i18nText(state === 'success' ? <p className="newsletter-feedback" role="status">{i18nText("Inscri\u00E7\u00E3o recebida. Obrigado por acompanhar Pausa do caf\u00E9.")}</p> : <form onSubmit={submit} noValidate>
    <label htmlFor={`${id}-name`}>{i18nText("Nome ")}<span className="optional">{i18nText("opcional")}</span><input id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} autoComplete="name" maxLength={100}/></label>
    <label htmlFor={`${id}-email`}>{i18nText("E-mail")}<input id={`${id}-email`} type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required aria-invalid={state === 'error' && !email.includes('@')}/></label>
    <label className="contact-honeypot" aria-hidden="true" htmlFor={`${id}-website`}>{i18nText("Deixe este campo vazio")}<input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)}/></label>
    <label className="newsletter-consent" htmlFor={`${id}-consent`}><input id={`${id}-consent`} type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required/><span>{i18nText("Aceito receber os textos por e-mail e li a ")}<Link href={i18nHref("/privacidade")}>{i18nText("pol\u00EDtica de privacidade")}</Link>{i18nText(".")}</span></label>
    <button className="pill filled" type="submit" disabled={state === 'sending'}>{i18nText(state === 'sending' ? 'Enviando…' : 'Inscrever-me ↗')}</button>
    <p className="newsletter-feedback" role="status" aria-live="polite">{i18nText(state === 'error' ? 'Confira o e-mail e o consentimento. Se estiverem corretos, tente novamente mais tarde.' : '')}</p>
  </form>)}</section>;
}
