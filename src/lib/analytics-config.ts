export const plausibleDomain=process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim()||'';

export const googleAnalyticsId=plausibleDomain
  ? ''
  : process.env.NEXT_PUBLIC_GA4_ID?.trim()||'G-6TFWKHN6CG';
