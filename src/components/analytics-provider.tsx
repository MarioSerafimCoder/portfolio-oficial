'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { googleAnalyticsId as ga4Id, plausibleDomain } from '@/lib/analytics-config';
import { PrivacyConsentBanner } from '@/components/privacy-consent-banner';
import { readPrivacyConsent, savePrivacyConsent, type PrivacyConsent } from '@/lib/privacy-consent';
export function AnalyticsProvider() {
    const { i18nText, i18nHref } = useSiteTranslation();
    const path = usePathname();
    const [consent, setConsent] = useState<PrivacyConsent | null | undefined>(undefined);
    const analyticsConfigured = Boolean(ga4Id || plausibleDomain);
    const analyticsAllowed = consent?.analytics === true;
    useEffect(() => {
        if (!analyticsConfigured)
            return;
        try {
            setConsent(readPrivacyConsent(localStorage));
        }
        catch {
            setConsent(null);
        }
    }, [analyticsConfigured]);
    useEffect(() => {
        if (ga4Id && analyticsAllowed)
            (window as Window & {
                gtag?: (...args: unknown[]) => void;
            }).gtag?.('config', ga4Id, { page_path: path });
    }, [path, analyticsAllowed]);
    if (!analyticsConfigured)
        return null;
    function decide(analytics: boolean) {
        try {
            setConsent(savePrivacyConsent(localStorage, analytics));
        }
        catch {
            setConsent({ essential: true, analytics, consentGiven: true, updatedAt: new Date().toISOString() });
        }
    }
    return <>{i18nText(analyticsAllowed && plausibleDomain && <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="lazyOnload"/>)}
    {i18nText(analyticsAllowed && ga4Id && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} strategy="afterInteractive"/><Script id="ga4-init" strategy="afterInteractive">{i18nText(`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ga4Id)});`)}</Script></>)}
    {i18nText(consent === null && <PrivacyConsentBanner onDecision={decide}/>)}
  </>;
}
