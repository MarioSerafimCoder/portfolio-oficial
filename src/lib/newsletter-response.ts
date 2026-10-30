export type NewsletterSubmissionState = 'pending' | 'success' | 'duplicate' | 'unavailable' | 'error';
export type NewsletterAnalyticsEvent = 'newsletter_signup_requested' | 'newsletter_signup_confirmed';

export function resolveNewsletterResponse(status: number, payload: unknown): {
  state: NewsletterSubmissionState;
  event?: NewsletterAnalyticsEvent;
} {
  const body = typeof payload === 'object' && payload !== null
    ? payload as {status?: unknown; code?: unknown}
    : {};
  if (status === 202 && body.status === 'pending_confirmation') {
    return {state: 'pending', event: 'newsletter_signup_requested'};
  }
  if (status === 200 && body.status === 'confirmed') {
    return {state: 'success', event: 'newsletter_signup_confirmed'};
  }
  if (status === 409) return {state: 'duplicate'};
  if (status === 503 && body.code === 'not_configured') return {state: 'unavailable'};
  return {state: 'error'};
}

export function beginNewsletterSubmission(lock: {current: boolean}) {
  if (lock.current) return false;
  lock.current = true;
  return true;
}
