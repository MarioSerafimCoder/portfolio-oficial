import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {deliveryPayload} from '../src/lib/contact.mjs';
const data={name:'Ana Teste',email:'ana@example.com',type:'Ainda não tenho certeza',budget:'',whatsapp:'',description:''};
function backend(){
 const mails=[],cache=new Map();
 const context={console,HtmlService:{createHtmlOutput:html=>({html,setXFrameOptionsMode(){return this}}),XFrameOptionsMode:{ALLOWALL:1}},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v)})},Utilities:{DigestAlgorithm:{SHA_256:1},computeDigest:(_,v)=>createHash('sha256').update(v).digest(),base64EncodeWebSafe:b=>Buffer.from(b).toString('base64url')},MailApp:{getRemainingDailyQuota:()=>100,sendEmail:mail=>mails.push(mail)}};
 vm.createContext(context);vm.runInContext(fs.readFileSync('integrations/gmail-contact/Code.gs','utf8'),context);
 return {send:p=>context.doPost({parameter:{...p,token:'a123-456'}}).html,mails};
}
test('campos opcionais vazios passam pela validação real do Apps Script',()=>{
 const b=backend(),payload=deliveryPayload(data,'http://localhost/#contato','2026-10-19T15:00:00Z');
 assert.match(b.send(payload),/"status":"sent"/);assert.equal(b.mails.length,1);
 assert.match(b.mails[0].body,/Ainda não tenho certeza/);assert.match(b.mails[0].body,/Data do contato: 2026-10-19/);assert.match(b.mails[0].body,/Origem: http:\/\/localhost/);
});
test('as cinco opções são aceitas pelo backend atual sem reimplantação',()=>{
 for(const type of ['Identidade visual','Branding','Direção de arte','Site ou experiência digital','Ainda não tenho certeza']){
  const b=backend();assert.match(b.send(deliveryPayload({...data,type},'http://localhost')),/"status":"sent"/);
 }
});
test('a mensagem inclui investimento, WhatsApp e descrição sem truncar no limite do servidor',()=>{
 const payload=deliveryPayload({...data,budget:'Acima de R$ 10.000',whatsapp:'+55 85 99999-0000',description:'á'.repeat(750)},'https://marioserafim.com.br/projetos/eduardo-noronha#contato');
 assert.ok(payload.description.length<=1200);const b=backend();b.send(payload);assert.ok(b.mails[0].body.includes('á'.repeat(750)));assert.match(b.mails[0].body,/Acima de R\$ 10.000/);
});
test('backend rejeita e-mail inválido e honeypot, sem enviar mensagem',()=>{
 const b=backend(),p=deliveryPayload(data,'http://localhost');assert.match(b.send({...p,email:'inválido'}),/"status":"invalid"/);assert.match(b.send({...p,website:'spam'}),/"status":"rejected"/);assert.equal(b.mails.length,0);
});
test('backend deduplica a solicitação e limita novos envios do remetente',()=>{
 const b=backend(),p=deliveryPayload(data,'http://localhost');b.send(p);b.send(p);assert.equal(b.mails.length,1);assert.match(b.send({...p,description:p.description+' outra solicitação'}),/"status":"retry"/);assert.equal(b.mails.length,1);
});
