import test from 'node:test';
import assert from 'node:assert/strict';
import {briefingText,mailtoDraft,emlDraft} from '../src/lib/contact.mjs';
const data={name:'João & Luísa',email:'joao+marca@example.com',type:'Identidade visual',description:'Uma marca com acentos, & símbolos? Sim.\nE duas linhas de briefing.'};
test('o rascunho preserva acentos, símbolos e quebras sem alterar o destinatário',()=>{
 const uri=new URL(mailtoDraft(data,'mario@example.com'));
 assert.equal(uri.pathname,'mario@example.com');
 assert.equal(uri.searchParams.get('subject'),'Novo projeto — Identidade visual');
 assert.equal(uri.searchParams.get('body'),briefingText(data));
 assert.ok(briefingText(data).includes(data.email));
});
test('o fallback EML abre como rascunho e preserva o texto UTF-8',()=>{
 const draft=emlDraft(data,'mario@example.com');
 assert.match(draft,/^To: mario@example.com\r\nSubject: =\?UTF-8\?B\?/);
 assert.match(draft,/X-Unsent: 1/);
 assert.ok(draft.includes(data.description.replace(/\n/g,'\r\n')));
 const encoded=draft.match(/Subject: =\?UTF-8\?B\?(.+)\?=/)[1];
 assert.equal(Buffer.from(encoded,'base64').toString('utf8'),'Novo projeto - Identidade visual');
});
