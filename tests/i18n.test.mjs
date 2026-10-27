import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {emptyState,prepareDocument,planDocuments,syncDocuments,googleTranslate,characters,usage} from '../scripts/i18n/core.mjs';
const now=()=>new Date('2026-10-27T12:00:00Z');
const document=(body='Um parágrafo.\n\nOutro parágrafo.')=>prepareDocument({id:'post:test',data:{title:'Título',summary:'Resumo',cover:'/media/test.png',category:'processo',publish_at:'2026-10-22T12:00'},body});
async function run(documents,state=emptyState(),extra={}){
 const requests=[];const persisted=[];
 await syncDocuments({documents,state,now,request:async q=>{requests.push(q);return q.map(text=>'EN '+text);},persist:async stage=>{persisted.push(stage);},sleep:async()=>{},...extra});
 return {state,requests,persisted};
}
test('new article translates all textual fields, preserving factual metadata',async()=>{
 const {state,requests,persisted}=await run([document()]);
 assert.equal(requests.length,1);assert.equal(persisted[0],'reservation');assert.equal(persisted.at(-1),'complete');
 assert.equal(state.documents['post:test'].data.title,'EN Título');assert.equal(state.documents['post:test'].data.cover,'/media/test.png');
 assert.equal(state.documents['post:test'].targetLanguage,'en');assert.equal(state.documents['post:test'].status,'translated');
});
test('identical article and repeated build cause zero translation requests',async()=>{
 const {state}=await run([document()]);const {requests}=await run([document()],state);assert.equal(requests.length,0);
 assert.equal(state.documents['post:test'].version,1);
});
test('one changed paragraph translates only that segment, reusing all others',async()=>{
 const {state}=await run([document()]);const {requests}=await run([document('Um parágrafo.\n\nParágrafo alterado.')],state);
 assert.deepEqual(requests,[['Parágrafo alterado.']]);assert.equal(state.documents['post:test'].version,2);
});
test('AST preserves links, image destinations, lists, inline/fenced code, HTML and emphasis',async()=>{
 const body='## Seção\n\nUm **texto** e *ênfase* com [link](https://example.com/a?q=1 "reference") e `const x = 1`.\n\n- Um item\n- Outro item\n\n![Descrição](/media/test.png "Legenda")\n\n```js\nconst url = "https://example.com";\n```\n\n<iframe src="https://example.com/embed"></iframe>\n';
 const {state,requests}=await run([document(body)]);const result=state.documents['post:test'].body;
 assert.ok(result.includes('**EN texto**'));assert.ok(result.includes('`const x = 1`'));assert.ok(result.includes('const url = "https://example.com";'));
 assert.ok(result.includes('https://example.com/a?q=1'));assert.ok(result.includes('/media/test.png'));assert.ok(result.includes('iframe src="https://example.com/embed"'));
 assert.ok(!requests.flat().some(text=>text.includes('const url')||text.includes('<iframe')));
});
test('approved translation is never overwritten; edited original becomes stale',async()=>{
 const {state}=await run([document()]);state.documents['post:test'].status='reviewed';state.documents['post:test'].review={approved:true};
 const before=state.documents['post:test'].body;const {requests}=await run([document('Texto alterado.')],state);
 assert.equal(requests.length,0);assert.equal(state.documents['post:test'].status,'stale');assert.equal(state.documents['post:test'].body,before);
});
test('403 is accounted once and not retried, without exposing the provider response',async()=>{
 const state=emptyState();let calls=0;await assert.rejects(run([document()],state,{request:async()=>{calls++;throw Object.assign(new Error('secret provider message'),{status:403})}}),/FAILED \(403\)/);
 assert.equal(calls,1);assert.ok(usage(state,400000,now()).used>0);assert.ok(!JSON.stringify(state).includes('secret provider message'));
});
test('429 retries are bounded and each attempt is reserved conservatively',async()=>{
 const state=emptyState();let calls=0;const expected=planDocuments([document()],state).estimatedCharacters;
 await assert.rejects(run([document()],state,{request:async()=>{calls++;throw Object.assign(new Error('rate limit'),{status:429})}}),/FAILED/);
 assert.equal(calls,3);assert.equal(usage(state,400000,now()).used,expected*3);
});
test('unavailable API never deletes existing translations and accounts timeout attempts',async()=>{
 const {state}=await run([document()]);const original=structuredClone(state.documents);
 await assert.rejects(run([document('Novo conteúdo.')],state,{request:async()=>{throw new Error('network')}}),/FAILED/);
 assert.deepEqual(state.documents,original);assert.equal(state.failures.length,3);
});
test('monthly cap blocks the entire plan before any API call',async()=>{
 const state=emptyState();state.months['2026-10']={used:399999,requests:[],alerted:[]};let calls=0;
 await assert.rejects(run([document()],state,{request:async()=>{calls++;return[]}}),/MONTHLY_LIMIT/);assert.equal(calls,0);assert.equal(state.months['2026-10'].used,399999);
});
test('budget persistence failure prevents network calls',async()=>{
 let calls=0;await assert.rejects(run([document()],emptyState(),{persist:async()=>{throw new Error('push rejected')},request:async()=>{calls++;return[]}}),/push rejected/);assert.equal(calls,0);
});
test('retry cannot cross monthly cap, and UTC month rollover resets only the new month',async()=>{
 const state=emptyState();const cost=planDocuments([document()],state).estimatedCharacters;
 state.months['2026-10']={used:400000-cost,requests:[],alerted:[]};let calls=0;
 await assert.rejects(run([document()],state,{request:async()=>{calls++;throw new Error('timeout')}}),/MONTHLY_LIMIT/);assert.equal(calls,1);assert.equal(state.months['2026-10'].used,400000);
 assert.equal(usage(state,400000,new Date('2026-11-01T00:00:00Z')).used,0);
});
test('progressive alerts are emitted once per threshold per month',async()=>{
 const state=emptyState();state.months['2026-10']={used:199999,requests:[],alerted:[]};await run([document()],state);
 assert.equal(state.alerts.length,1);assert.equal(state.alerts[0].level,50);await run([document()],state);assert.equal(state.alerts.length,1);
});
test('character accounting includes spaces and counts Unicode code points',()=>{assert.equal(characters('a 😀 b'),5);});
test('bad protected names response is rejected; invalid result is never published',async()=>{
 const state=emptyState();await assert.rejects(run([document('Mário Serafim trabalha.')],state,{request:async q=>q.map(()=> 'The name was removed')}),/FAILED/);assert.deepEqual(state.documents,{});
});
test('Google v2 request uses a private header, NMT, timeout and no key in URL',async()=>{
 let captured;await googleTranslate(['hello'],{key:'not-a-real-key',fetchImpl:async(url,options)=>{captured={url,options};return {ok:true,json:async()=>({data:{translations:[{translatedText:'Olá'}]}})}}});
 assert.ok(!captured.url.includes('key='));assert.equal(captured.options.headers['X-Goog-Api-Key'],'not-a-real-key');assert.equal(JSON.parse(captured.options.body).model,'nmt');assert.ok(captured.options.signal);
});
test('file lock rejects a concurrent sync process before it can consume anything',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'i18n-lock-'));fs.writeFileSync(path.join(dir,'.i18n-sync.lock'),'locked');
 const script=path.resolve('scripts/i18n-sync.mjs');const result=spawnSync(process.execPath,[script],{cwd:dir,encoding:'utf8'});
 assert.notEqual(result.status,0);assert.match(result.stderr,/ALREADY_RUNNING/);fs.unlinkSync(path.join(dir,'.i18n-sync.lock'));fs.rmdirSync(dir);
});
test('GitHub workflow serializes runs and does not translate on normal build',()=>{
 const workflow=fs.readFileSync('.github/workflows/translations.yml','utf8');assert.match(workflow,/portfolio-translation-budget-main/);assert.match(workflow,/cancel-in-progress: false/);
 const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));assert.ok(!pkg.scripts.build.includes('--apply'));assert.ok(!fs.readFileSync('src/components/journal-article.tsx','utf8').includes('googleapis'));
});
