export const PRIVACY_CONSENT_KEY='ms-privacy-consent-v1';
export const LEGACY_ANALYTICS_CONSENT_KEY='ms-analytics-consent';

export type PrivacyConsent={
  essential:true;
  analytics:boolean;
  consentGiven:true;
  updatedAt:string;
};

type ConsentStorage=Pick<Storage,'getItem'|'setItem'|'removeItem'>;

export function createPrivacyConsent(analytics:boolean,updatedAt=new Date()):PrivacyConsent{
  return {essential:true,analytics,consentGiven:true,updatedAt:updatedAt.toISOString()};
}

export function parsePrivacyConsent(value:string|null):PrivacyConsent|null{
  if(!value)return null;
  try{
    const parsed=JSON.parse(value) as Partial<PrivacyConsent>;
    if(parsed.essential!==true||typeof parsed.analytics!=='boolean'||parsed.consentGiven!==true||typeof parsed.updatedAt!=='string'||Number.isNaN(Date.parse(parsed.updatedAt)))return null;
    return parsed as PrivacyConsent;
  }catch{return null}
}

export function readPrivacyConsent(storage:ConsentStorage):PrivacyConsent|null{
  const current=parsePrivacyConsent(storage.getItem(PRIVACY_CONSENT_KEY));
  if(current)return current;
  const legacy=storage.getItem(LEGACY_ANALYTICS_CONSENT_KEY);
  if(legacy!=='accepted'&&legacy!=='rejected')return null;
  const migrated=createPrivacyConsent(legacy==='accepted');
  storage.setItem(PRIVACY_CONSENT_KEY,JSON.stringify(migrated));
  storage.removeItem(LEGACY_ANALYTICS_CONSENT_KEY);
  return migrated;
}

export function savePrivacyConsent(storage:ConsentStorage,analytics:boolean):PrivacyConsent{
  const consent=createPrivacyConsent(analytics);
  storage.setItem(PRIVACY_CONSENT_KEY,JSON.stringify(consent));
  storage.removeItem(LEGACY_ANALYTICS_CONSENT_KEY);
  return consent;
}
