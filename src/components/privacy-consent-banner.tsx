'use client';

import Link from 'next/link';

export function PrivacyConsentBanner({onDecision}:{onDecision:(analytics:boolean)=>void}){
  return <aside className="privacy-consent-banner" role="region" aria-labelledby="privacy-consent-title" aria-describedby="privacy-consent-description">
    <div className="privacy-consent-copy">
      <span className="privacy-consent-eyebrow"><span aria-hidden="true"/>Preferências do site</span>
      <h2 id="privacy-consent-title">Privacidade e cookies</h2>
      <p id="privacy-consent-description">Usamos cookies essenciais para o funcionamento do site e, com sua permissão, cookies analíticos para entender como ele é utilizado e melhorar sua experiência.</p>
      <Link href="/privacidade">Política de privacidade e cookies</Link>
    </div>
    <div className="privacy-consent-actions">
      <button type="button" className="privacy-consent-decline" onClick={()=>onDecision(false)}>Recusar</button>
      <button type="button" className="privacy-consent-accept" onClick={()=>onDecision(true)}>Aceitar</button>
    </div>
  </aside>;
}
