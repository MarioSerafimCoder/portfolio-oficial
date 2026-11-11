'use client';

import {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import {journalCopy} from '@/content/journal-i18n';
import {trackEvent} from '@/lib/analytics';
import {useJournalPreferences} from './journal-preferences';

type ShareMethod = 'copy' | 'linkedin' | 'whatsapp' | 'telegram' | 'email';
type ShareIconKind = ShareMethod | 'share' | 'chevron';

function trackShare(method: ShareMethod) {
  try {
    trackEvent('journal_share', {method});
  } catch {
    // Sharing stays available when browser storage blocks analytics.
  }
}

const iconPaths: Record<ShareIconKind, React.ReactNode> = {
  share: <><circle cx="6" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/></>,
  chevron: <path d="m6 9 6 6 6-6"/>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v6m0-9h.01m4 9v-6m0 2a2 2 0 0 1 4 0v4"/></>,
  whatsapp: <><path d="M20.5 11.8a8.5 8.5 0 0 1-12.4 7.5L3.5 20.5l1.3-4.4a8.5 8.5 0 1 1 15.7-4.3Z"/><path d="M9 8.5c0 2.7 2.5 5.2 5 5.5l1-1.2m-6-4.3.7 1.3"/></>,
  telegram: <><path d="m3 10 18-7-4 18-5.2-4.5-3 2.5v-5.2L17 7"/><path d="m3 10 5.8 3.8m0 0 3 2.7"/></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
};

function ShareIcon({kind}: {kind: ShareIconKind}) {
  return (
    <svg className={`journal-share-icon journal-share-icon-${kind}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {iconPaths[kind]}
    </svg>
  );
}

const panelMargin = 12;
const panelGap = 8;

function positionSharePanel(trigger: HTMLButtonElement, panel: HTMLElement) {
  const viewport = window.visualViewport;
  const x = viewport?.offsetLeft ?? 0;
  const y = viewport?.offsetTop ?? 0;
  const width = viewport?.width ?? document.documentElement.clientWidth;
  const height = viewport?.height ?? document.documentElement.clientHeight;
  const anchor = trigger.getBoundingClientRect();

  if (anchor.bottom <= y || anchor.top >= y + height) {
    panel.hidePopover();
    return;
  }

  panel.style.maxWidth = `${width - 2 * panelMargin}px`;
  const panelWidth = panel.offsetWidth;
  const naturalHeight = panel.scrollHeight + panel.offsetHeight - panel.clientHeight;
  const below = y + height - panelMargin - anchor.bottom - panelGap;
  const above = anchor.top - panelGap - y - panelMargin;
  const placeAbove = naturalHeight > below && above > below;
  const available = Math.max(1, placeAbove ? above : below);
  panel.style.maxHeight = `${available}px`;
  panel.style.left = `${Math.max(x + panelMargin, Math.min(anchor.left, x + width - panelMargin - panelWidth))}px`;
  panel.style.top = `${placeAbove ? anchor.top - panelGap - panel.offsetHeight : anchor.bottom + panelGap}px`;
  panel.dataset.positioned = 'true';
}

export function JournalShare({url, title, variant = 'end'}: {
  url?: string;
  title?: string;
  variant?: 'compact' | 'end';
}) {
  const {locale} = useJournalPreferences();
  const copy = journalCopy[locale];
  const [pageUrl, setPageUrl] = useState('');
  const [status, setStatus] = useState<'copied' | 'error' | null>(null);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelId = useId();
  const shareUrl = url || pageUrl;
  const articleTitle = title || copy.shareTitle;

  useEffect(() => {
    if (!url) setPageUrl(`${window.location.origin}${window.location.pathname}`);
  }, [url, locale]);

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!open || !trigger || !panel) return;

    let frame = 0;
    const position = () => {
      if (panel.matches(':popover-open')) positionSharePanel(trigger, panel);
    };
    const schedulePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(position);
    };
    const restoreFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !panel.matches(':popover-open')) return;
      event.preventDefault();
      panel.hidePopover();
      trigger.focus({preventScroll: true});
    };

    position();
    const observer = new ResizeObserver(schedulePosition);
    observer.observe(panel);
    window.addEventListener('scroll', schedulePosition, {capture: true, passive: true});
    window.addEventListener('resize', schedulePosition);
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', schedulePosition);
    viewport?.addEventListener('scroll', schedulePosition);
    document.addEventListener('keydown', restoreFocus);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedulePosition, true);
      window.removeEventListener('resize', schedulePosition);
      viewport?.removeEventListener('resize', schedulePosition);
      viewport?.removeEventListener('scroll', schedulePosition);
      document.removeEventListener('keydown', restoreFocus);
      delete panel.dataset.positioned;
    };
  }, [open]);

  async function copyLink() {
    trackShare('copy');
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(articleTitle);
  const message = encodeURIComponent(`${articleTitle}\n${shareUrl}`);
  const links = [
    {method: 'linkedin', label: 'LinkedIn', action: copy.shareLinkedIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`},
    {method: 'whatsapp', label: 'WhatsApp', action: copy.shareWhatsApp, href: `https://wa.me/?text=${message}`},
    {method: 'telegram', label: 'Telegram', action: copy.shareTelegram, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`},
    {method: 'email', label: copy.shareEmailLabel, action: copy.shareEmail, href: `mailto:?subject=${encodedTitle}&body=${message}`},
  ] as const;

  const feedback = (
    <>
      <span className="journal-share-feedback" role="status">
        {status === 'copied' ? copy.copied : status === 'error' ? copy.copyError : ''}
      </span>
      {status === 'error' && (
        <input className="journal-share-link" aria-label={copy.shareLinkLabel} readOnly value={shareUrl} onFocus={event => event.currentTarget.select()} onClick={event => event.currentTarget.select()}/>
      )}
    </>
  );

  if (variant === 'compact') {
    return (
      <div className="journal-share-compact">
        <button ref={triggerRef} className="journal-share-trigger" type="button" popoverTarget={panelId} aria-controls={panelId} aria-expanded={open} disabled={!shareUrl}>
          <ShareIcon kind="share"/>
          {copy.share}
          <ShareIcon kind="chevron"/>
        </button>
        <section
          ref={panelRef}
          className="journal-share-panel"
          id={panelId}
          popover="auto"
          aria-labelledby={`${panelId}-title`}
          aria-describedby={`${panelId}-description`}
          onToggle={event => {
            const isOpen = event.newState === 'open';
            setOpen(isOpen);
            if (!isOpen) setStatus(null);
          }}
        >
          <h2 id={`${panelId}-title`}>{copy.shareTitle}</h2>
          <p id={`${panelId}-description`}>{copy.shareDescription}</p>
          <div className="journal-share-grid">
            <button type="button" onClick={copyLink}>
              <span className="journal-share-tile"><ShareIcon kind="copy"/></span>
              {copy.copy}
            </button>
            {links.map(({method, label, action, href}) => (
              <a key={method} href={href} {...(method === 'email' ? {} : {target: '_blank', rel: 'noopener noreferrer'})}
                aria-label={method === 'email' ? action : `${action} (${copy.shareNewTab})`}
                onClick={() => trackShare(method)}>
                <span className="journal-share-tile"><ShareIcon kind={method}/></span>
                {label}
              </a>
            ))}
          </div>
          {feedback}
        </section>
      </div>
    );
  }

  return (
    <div className="journal-share journal-share-end">
      <span className="journal-share-label">{copy.shareEnd}</span>
      <button type="button" onClick={copyLink} disabled={!shareUrl}>{copy.copy} ↗</button>
      {shareUrl && links.slice(0, 2).map(({method, action, href}) => (
        <a key={method} href={href} target="_blank" rel="noopener noreferrer"
          aria-label={`${action} (${copy.shareNewTab})`} onClick={() => trackShare(method)}>
          <ShareIcon kind={method}/>{action} <span aria-hidden="true">↗</span>
        </a>
      ))}
      {feedback}
    </div>
  );
}
