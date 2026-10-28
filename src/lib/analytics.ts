import {parsePrivacyConsent,PRIVACY_CONSENT_KEY} from '@/lib/privacy-consent';

export type AnalyticsEvent = 'contact_form_start' | 'contact_form_submit' | 'whatsapp_click' | 'booking_click' | 'social_click' | 'newsletter_signup' | 'case_view' | 'all_projects_click' | 'journal_article_open' | 'journal_filter' | 'journal_search' | 'journal_related_click' | 'journal_share';

export function trackEvent(event: AnalyticsEvent, props: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('portfolio:analytics', {detail: {event, ...props}}));
  const plausible = (window as Window & {plausible?: (name: string, options?: {props: Record<string, string>}) => void}).plausible;
  if (plausible) plausible(event, {props});
  const gtag = (window as Window & {gtag?: (...args: unknown[]) => void}).gtag;
  const consent=parsePrivacyConsent(localStorage.getItem(PRIVACY_CONSENT_KEY));
  if (gtag && consent?.analytics) gtag('event', event, props);
}
