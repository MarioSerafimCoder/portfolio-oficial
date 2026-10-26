import test from 'node:test';
import assert from 'node:assert/strict';
import {createPrivacyConsent,parsePrivacyConsent,readPrivacyConsent,savePrivacyConsent,PRIVACY_CONSENT_KEY,LEGACY_ANALYTICS_CONSENT_KEY} from '../src/lib/privacy-consent.ts';

function memoryStorage(initial={}){
  const values=new Map(Object.entries(initial));
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key),values};
}

test('creates and parses a complete consent decision',()=>{
  const consent=createPrivacyConsent(true,new Date('2026-10-26T12:00:00.000Z'));
  assert.deepEqual(consent,{essential:true,analytics:true,consentGiven:true,updatedAt:'2026-10-26T12:00:00.000Z'});
  assert.deepEqual(parsePrivacyConsent(JSON.stringify(consent)),consent);
  assert.equal(parsePrivacyConsent('{invalid'),null);
  assert.equal(parsePrivacyConsent(JSON.stringify({...consent,essential:false})),null);
});

test('migrates and respects a previous analytics refusal',()=>{
  const storage=memoryStorage({[LEGACY_ANALYTICS_CONSENT_KEY]:'rejected'});
  const consent=readPrivacyConsent(storage);
  assert.equal(consent?.analytics,false);
  assert.equal(storage.getItem(LEGACY_ANALYTICS_CONSENT_KEY),null);
  assert.deepEqual(parsePrivacyConsent(storage.getItem(PRIVACY_CONSENT_KEY)),consent);
});

test('saves one decision for essential and analytics categories',()=>{
  const storage=memoryStorage();
  const consent=savePrivacyConsent(storage,true);
  assert.equal(consent.essential,true);
  assert.equal(consent.analytics,true);
  assert.deepEqual(readPrivacyConsent(storage),consent);
});
