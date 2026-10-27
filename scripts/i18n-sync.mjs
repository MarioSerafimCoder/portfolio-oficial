import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import matter from 'gray-matter';
import {fileURLToPath} from 'node:url';
import {parseYaml} from '../cloudflare/publication.mjs';
import {extractSiteStrings} from './i18n/extract.mjs';
import {emptyState,prepareDocument,planDocuments,syncDocuments,googleTranslate,usage,DEFAULT_LIMIT,ENGINE} from './i18n/core.mjs';

const root=process.cwd();
const stateFile=path.join(root,'src/i18n/state.json');
const json=(file,fallback)=>fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):fallback;
const write=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});const temporary=file+'.tmp';fs.writeFileSync(temporary,JSON.stringify(value,null,2)+'\n');fs.renameSync(temporary,file);};
export function sourceDocuments(){
 const strings=extractSiteStrings(root);write(path.join(root,'src/i18n/source/site.json'),strings);
 const documents=[prepareDocument({id:'site',strings})];
 for(const file of fs.readdirSync('src/content/posts').filter(file=>file.endsWith('.md')).sort()){
  const {data,content}=matter(fs.readFileSync(path.join('src/content/posts',file),'utf8'),{engines:{yaml:parseYaml}});
  // Drafts never consume quota. Scheduled publications can be prepared before they go live.
  if(data.status!=='published')continue;
  documents.push(prepareDocument({id:`post:${file.slice(0,-3)}`,data,body:content}));
 }
 return documents;
}
export function applyReviews(state,documents){
 const folder='src/i18n/reviews';if(!fs.existsSync(folder))return;
 for(const file of fs.readdirSync(folder).filter(file=>file.endsWith('.md'))){
  const id=`post:${file.slice(0,-3)}`;const source=documents.find(document=>document.id===id);if(!source)continue;
  const {data,content}=matter(fs.readFileSync(path.join(folder,file),'utf8'),{engines:{yaml:parseYaml}});
  if(data.review_status!=='reviewed')continue;
  if(!data.source_hash||!data.title||!data.summary||!content.trim())throw new Error(`TRANSLATION_REVIEW_INCOMPLETE: ${file}`);
  const old=state.documents[id];
  state.documents[id]={...old,id,sourceLanguage:'pt-BR',targetLanguage:'en',sourceHash:data.source_hash,status:data.source_hash===source.sourceHash?'reviewed':'stale',version:old?.version||1,engine:'manual-editorial-review',review:{approved:true},data:{...source.fields,...Object.fromEntries(Object.entries(data).filter(([key])=>!['source_hash','review_status'].includes(key)))},body:content};
 }
}
export function applyEditorial(state,documents){
 const file='src/i18n/editorial/site.json';if(!fs.existsSync(file))return;
 const approved=JSON.parse(fs.readFileSync(file,'utf8'));const site=documents.find(document=>document.id==='site');
 for(const segment of site?.segments||[]){const text=approved[segment.source];if(typeof text!=='string'||!text.trim())continue;
  state.memory[segment.hash]={text,engine:ENGINE,reviewed:true,provenance:'manual-editorial-v1'};
  if(state.documents.site?.strings)state.documents.site.strings[segment.source]=text;
 }
}
export function exportTranslations(state,documents,{writeReviewDrafts=false}={}){
 const site=state.documents.site;
 write('src/i18n/en/site.json',site&&['translated','reviewed'].includes(site.status)&&site.sourceHash===documents.find(d=>d.id==='site')?.sourceHash?site.strings:{});
 const posts={};const statuses={};
 for(const document of documents){
  const entry=state.documents[document.id];
  const current=entry?.sourceHash===document.sourceHash;
  statuses[document.id]=!entry?'pending':!current?'stale':entry.status;
  if(document.id.startsWith('post:')&&current&&['translated','reviewed'].includes(entry.status)){
   const slug=document.id.slice(5);posts[slug]={...entry.data,body:entry.body,sourceHash:entry.sourceHash,status:entry.status};
   const file=`src/i18n/reviews/${slug}.md`;
   if(writeReviewDrafts&&entry.status==='translated'&&!fs.existsSync(file)){
    fs.mkdirSync(path.dirname(file),{recursive:true});
    fs.writeFileSync(file,matter.stringify(entry.body,{slug,title:entry.data.title,summary:entry.data.summary,seo_title:entry.data.seo_title||entry.data.title,seo_description:entry.data.seo_description||entry.data.summary,cover_alt:entry.data.cover_alt||'',source_hash:entry.sourceHash,review_status:'draft'}));
   }
  }
 }
 write('src/i18n/en/posts.json',posts);
 write('src/i18n/status.json',statuses);
 write('src/i18n/manifest.json',{site:Boolean(site&&site.sourceHash===documents.find(d=>d.id==='site')?.sourceHash&&['translated','reviewed'].includes(site.status)),posts:[...Object.keys(posts),'exemplo-de-leitura'],categories:[...new Set(Object.values(posts).map(post=>post.category))]});
}
function report(state,documents,limit){
 const plan=planDocuments(documents,state);const count=usage(state,limit);
 return {lastSync:state.lastSync||null,articles:documents.length-1,translated:documents.filter(d=>d.id!=='site'&&state.documents[d.id]?.sourceHash===d.sourceHash&&['translated','reviewed'].includes(state.documents[d.id]?.status)).length,pending:plan.pending,stale:plan.stale,needsReview:documents.filter(d=>state.documents[d.id]?.status==='pending-review').map(d=>d.id),sourceHashes:Object.fromEntries(documents.map(d=>[d.id,d.sourceHash])),estimatedCharacters:plan.estimatedCharacters,usage:count,failures:state.failures.slice(-5),block:state.lastBlock||null,alerts:state.alerts||[]};
}
function saveReport(state,documents,limit){
 const value=report(state,documents,limit);write('i18n-reports/status.json',value);
 const text=`# Traduções — diagnóstico\n\nReferência: ${value.usage.date}\n\n- Artigos: ${value.articles}\n- Traduzidos: ${value.translated}\n- Pendentes: ${value.pending.join(', ')||'nenhum'}\n- Desatualizados: ${value.stale.join(', ')||'nenhum'}\n- Mês UTC: ${value.usage.month}\n- Consumo reservado (inclui falhas): ${value.usage.used} / ${value.usage.limit} caracteres (${value.usage.percent}%)\n- Restantes: ${value.usage.remaining}\n- Estimativa da próxima sincronização: ${value.estimatedCharacters}\n- Última sincronização: ${value.lastSync||'nunca'}\n- Bloqueio: ${value.block?.reason||'nenhum'}\n\n${value.alerts.filter(a=>a.month===value.usage.month).map(a=>`- Alerta ${a.level}%: ${a.used}/${a.limit}; ${a.remaining} restantes; ${a.translatedContents} conteúdos; ${a.date}`).join('\n')}\n\nFalhas recentes: ${value.failures.map(f=>`${f.date} (${f.code})`).join('; ')||'nenhuma'}.\n\nNenhum serviço de e-mail de alertas está configurado. Consulte este relatório e o resumo do Actions.\n`;
 fs.writeFileSync('i18n-reports/status.md',text);
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,text);
 console.log(JSON.stringify(value,null,2));
}
export async function main(){
 const lock=path.join(root,'.i18n-sync.lock');let handle;
 try{handle=fs.openSync(lock,'wx');}catch{throw new Error('TRANSLATION_SYNC_ALREADY_RUNNING');}
 const state=json(stateFile,emptyState());const limit=Number(process.env.TRANSLATION_MONTHLY_LIMIT||DEFAULT_LIMIT);
 let documents=[];
 const git=(...args)=>execFileSync('git',args,{stdio:'pipe',encoding:'utf8'});
 const apply=process.argv.includes('--apply');
 try{
  documents=sourceDocuments();
  applyReviews(state,documents);
  applyEditorial(state,documents);
  if(apply){
   if(process.env.GITHUB_ACTIONS!=='true'||process.env.I18N_PERSIST_GIT!=='1')throw new Error('TRANSLATION_DURABLE_CI_REQUIRED: use the serialized GitHub Actions workflow; local runs are estimates only.');
   if(planDocuments(documents,state).segments.length&&!process.env.GOOGLE_TRANSLATE_API_KEY)throw new Error('GOOGLE_TRANSLATE_API_KEY_MISSING');
   if(git('status','--porcelain','--untracked-files=no').trim() && !process.argv.includes('--ci-extracted'))throw new Error('TRANSLATION_DIRTY_CHECKOUT');
   const persist=async stage=>{
    write(stateFile,state);
    // Commit only translation state; never stage owner edits or source content.
    git('add','--','src/i18n');
    if(!git('diff','--cached','--name-only').trim())return;
    git('commit','-m',stage==='complete'?'i18n: publish saved translations':'[skip ci] i18n: persist budget and translation memory');
    // A rejected push aborts before the API. No automatic rebase of financial reservations.
    git('push','origin','HEAD:main');
   };
   await syncDocuments({documents,state,limit,request:q=>googleTranslate(q,{key:process.env.GOOGLE_TRANSLATE_API_KEY}),persist:async stage=>{if(stage==='complete')exportTranslations(state,documents,{writeReviewDrafts:true});await persist(stage);}});
  }else{
   // Public artifacts derive from versioned state and require no API or credentials.
   if(planDocuments(documents,state).estimatedCharacters===0)await syncDocuments({documents,state,limit,request:async()=>{throw new Error('OFFLINE_BUILD_API_FORBIDDEN');},persist:async()=>{}});
   exportTranslations(state,documents);
  }
 }finally{
  if(documents.length)saveReport(state,documents,limit);
  fs.closeSync(handle);fs.unlinkSync(lock);
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message.replace(/AIza[\w-]+/g,'[REDACTED]'));process.exitCode=1;});
