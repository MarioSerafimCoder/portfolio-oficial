'use client';

import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import Script from 'next/script';

const plausibleDomain=process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
const ga4Id=plausibleDomain?'':process.env.NEXT_PUBLIC_GA4_ID?.trim();

export function AnalyticsProvider(){
  const path=usePathname();
  const [consent,setConsent]=useState<'accepted'|'rejected'|null>(null);
  useEffect(()=>{if(ga4Id)setConsent(localStorage.getItem('ms-analytics-consent') as 'accepted'|'rejected'|null)},[]);
  useEffect(()=>{
    if(ga4Id&&consent==='accepted') (window as Window & {gtag?:(...args:unknown[])=>void}).gtag?.('config',ga4Id,{page_path:path});
  },[path,consent]);
  if(plausibleDomain)return <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="lazyOnload"/>;
  if(!ga4Id)return null;
  return <>{consent==='accepted'&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} strategy="afterInteractive"/><Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ga4Id)});`}</Script></>}
    {!consent&&<aside className="analytics-consent" aria-label="Preferência de métricas"><p>Posso usar métricas para entender quais páginas são visitadas. Elas só serão ativadas com sua escolha.</p><div><button type="button" onClick={()=>{localStorage.setItem('ms-analytics-consent','rejected');setConsent('rejected')}}>Recusar</button><button type="button" onClick={()=>{localStorage.setItem('ms-analytics-consent','accepted');setConsent('accepted')}}>Aceitar métricas</button></div></aside>}
  </>;
}
