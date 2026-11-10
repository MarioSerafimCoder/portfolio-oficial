import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHash,createHmac,randomUUID} from 'node:crypto';
const script=readFileSync(new URL('../integrations/gmail-contact/Code.gs',import.meta.url),'utf8');
function setup(fail=false){const events=[],cache=new Map();let delivered;
const sandbox={console:{warn:code=>events.push(code),error:code=>events.push(code)},PropertiesService:{getScriptProperties:()=>({getProperty:()=> 's'.repeat(40)})},Utilities:{getUuid:randomUUID,Charset:{UTF_8:'utf8'},DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,s)=>[...createHash('sha256').update(s).digest()],base64EncodeWebSafe:b=>Buffer.from(b).toString('base64url'),computeHmacSha256Signature:(s,key)=>[...createHmac('sha256',key).update(s).digest()]},UrlFetchApp:{fetch:(url,options)=>{events.push('forward');delivered={url,options};if(fail)throw Error('personal@example.invalid');return{getResponseCode:()=>200,getContentText:()=>options.payload}}},MailApp:{getRemainingDailyQuota:()=>10,sendEmail:()=>events.push('email')},CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v)})},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{}})},ContentService:{MimeType:{JSON:"json"},createTextOutput:body=>({setMimeType:()=>body})},HtmlService:{XFrameOptionsMode:{ALLOWALL:1},createHtmlOutput:html=>({setXFrameOptionsMode:()=>html})}};
vm.createContext(sandbox);vm.runInContext(script,sandbox);return{sandbox,events,get delivered(){return delivered}};}
const parameter={name:'Contato sintético',email:'synthetic@example.invalid',type:'Branding',description:'Descrição sintética de projeto para validar o envio.',summary:'Descrição sintética resumida para oportunidade.',industry:'Design',whatsapp:'11999999999',budget:'A combinar'};
test('email precedes authenticated forwarding; duplicated submission does not resend',()=>{const s=setup();assert.match(s.sandbox.doPost({parameter}),/"status":"sent"/);assert.deepEqual(s.events,['email','forward']);const {options}=s.delivered;const expected=createHmac('sha256','s'.repeat(40)).update(options.headers['X-Portfolio-Time']+'\nPOST\n/integration/v1/opportunities\n'+options.payload).digest('hex');assert.equal(options.headers['X-Portfolio-Signature'],expected);assert.equal(JSON.parse(options.payload).area,'Design');s.sandbox.doPost({parameter});assert.equal(s.events.length,2)});
test('Lastro failure does not change email success or leak personal diagnostics',()=>{const s=setup(true);assert.match(s.sandbox.doPost({parameter}),/"status":"sent"/);assert.ok(s.events.includes('opportunities_delivery_unavailable'));assert.ok(!s.events.join().includes('personal@'))});
test('invalid input never sends or forwards',()=>{const s=setup();s.sandbox.doPost({parameter:{...parameter,email:'invalid'}});assert.deepEqual(s.events,[])});

test('only an authenticated fresh probe reaches Lastro without sending mail', () => {
  const s = setup();
  const probe = randomUUID(), timestamp = String(Date.now());
  const signature = createHmac('sha256', 's'.repeat(40))
    .update('lastro-portfolio-probe\n' + timestamp + '\n' + probe).digest('hex');
  const send = payload => JSON.parse(s.sandbox.doPost({
    postData: { type: 'application/json; charset=utf-8', contents: JSON.stringify(payload) }
  }));
  assert.deepEqual(send({ probe, timestamp, signature: '0'.repeat(64) }), {});
  assert.deepEqual(s.events, []);
  assert.deepEqual(send({ probe, timestamp, signature }), { probe });
  assert.deepEqual(s.events, ['forward']);
  assert.deepEqual(JSON.parse(s.delivered.options.payload), { probe });
  assert.deepEqual(send({ probe, timestamp, signature }), {});
  assert.deepEqual(s.events, ['forward']);
});
