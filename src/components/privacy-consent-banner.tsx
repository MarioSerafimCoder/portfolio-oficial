'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
import Link from 'next/link';
export function PrivacyConsentBanner({ onDecision }: {
    onDecision: (analytics: boolean) => void;
}) {
    const { i18nText, i18nHref } = useSiteTranslation();
    return <aside className="privacy-consent-banner" role="region" aria-labelledby="privacy-consent-title" aria-describedby="privacy-consent-description">
    <div className="privacy-consent-copy">
      <span className="privacy-consent-eyebrow"><span aria-hidden="true"/>{i18nText("Prefer\u00EAncias do site")}</span>
      <h2 id="privacy-consent-title">{i18nText("Privacidade e cookies")}</h2>
      <p id="privacy-consent-description">{i18nText("Usamos cookies essenciais para o funcionamento do site e, com sua permiss\u00E3o, cookies anal\u00EDticos para entender como ele \u00E9 utilizado e melhorar sua experi\u00EAncia.")}</p>
      <Link href={i18nHref("/privacidade")}>{i18nText("Pol\u00EDtica de privacidade e cookies")}</Link>
    </div>
    <div className="privacy-consent-actions">
      <button type="button" className="privacy-consent-decline" onClick={() => onDecision(false)}>{i18nText("Recusar")}</button>
      <button type="button" className="privacy-consent-accept" onClick={() => onDecision(true)}>{i18nText("Aceitar")}</button>
    </div>
  </aside>;
}
