import {createHash, randomUUID} from 'node:crypto';
import {fromMarkdown} from 'mdast-util-from-markdown';
import {toMarkdown} from 'mdast-util-to-markdown';

export const ENGINE = 'google-basic-v2:nmt:pt-en:text:ast-v1';
export const DEFAULT_LIMIT = 400000;
export const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const characters = text => [...text].length;
export const monthKey = (now = new Date()) => now.toISOString().slice(0, 7);
export const emptyState = () => ({schemaVersion: 1, documents: {}, memory: {}, months: {}, failures: []});
const translatedFields = new Set(['title','subtitle','summary','description','seo_title','seo_description','cover_alt']);
const protectedNames = ['Mário Serafim','Granistone','Amazonita','Rooftop Arquitetura','Simetria Estética','Adobe','Photoshop','Google Flow','LinkedIn','Instagram','Buttondown','Zoho Mail','Pages CMS','Cloudflare','GitHub'];

function walk(node, visit, parents = []) {
  visit(node, parents);
  node.children?.forEach(child => walk(child, visit, [...parents, node]));
}
function skeleton(tree) {
  const copy=JSON.parse(JSON.stringify(tree,(key,value)=>key==='position'?undefined:value));
  walk(copy,node=>{if(node.type==='text')node.value='__text__';if(node.type==='image'){if(node.alt!==undefined)node.alt='__alt__';if(node.title)node.title='__title__';}});
  return copy;
}
export function prepareDocument({id, data = {}, body, strings}) {
  const tree = body === undefined ? undefined : fromMarkdown(body);
  const segments = [];
  const add = (key, value, assign) => {
    if (typeof value !== 'string' || !value.trim()) return;
    segments.push({key, source: value, hash: hash({engine: ENGINE, value}), assign});
  };
  const fields = structuredClone(data);
  if (strings) for (const [key,value] of Object.entries(strings)) add(key, value, text => {fields[key] = text;});
  else for (const [key,value] of Object.entries(data)) if (translatedFields.has(key)) add(key,value,text => {fields[key]=text;});
  let index = 0;
  let requiresReview=false;
  const bibliography=new Set();let inBibliography=false;
  for(const node of tree?.children||[]){if(node.type==='heading')inBibliography=/^(referências|referencias|fontes|bibliografia)$/i.test(node.children?.map(child=>child.value||'').join('')||'');else if(inBibliography)walk(node,child=>bibliography.add(child));}
  if (tree) walk(tree, (node, parents) => {
    if(node.type==='html')requiresReview=true;
    // Literal HTML/MDX, fenced code, inline code, URLs and definitions never reach the API.
    if (node.type === 'text' && !bibliography.has(node) && !parents.some(parent => ['code','inlineCode','html','definition'].includes(parent.type))) add(`text:${index++}`, node.value, text => {node.value=text;});
    if (node.type === 'image') {
      add(`image:${index++}:alt`,node.alt,text=>{node.alt=text;});
      if(node.title)add(`image:${index++}:title`,node.title,text=>{node.title=text;});
    }
  });
  const sourceHash=hash({data,body,strings});
  return {id,sourceHash,segments,tree,fields, originalTree:structuredClone(tree), render(){
    if(tree){
      if(hash(skeleton(tree))!==hash(skeleton(this.originalTree)))throw new Error('TRANSLATION_STRUCTURE_CHANGED');
      // Only translatable node values are changed; destinations and code retain exact values.
      const translatedBody=toMarkdown(tree);
      if(hash(skeleton(fromMarkdown(translatedBody)))!==hash(skeleton(tree)))throw new Error('TRANSLATION_ROUNDTRIP_INVALID');
      return {data:fields,body:translatedBody,requiresReview};
    }
    return {strings:fields};
  }};
}
export function planDocuments(documents,state){
  const needed=new Map(); const pending=[]; const stale=[];
  for(const document of documents){
    const existing=state.documents[document.id];
    if(existing?.sourceHash===document.sourceHash && ['reviewed','translated','pending-review'].includes(existing.status))continue;
    if(existing?.status==='reviewed' || existing?.status==='stale') {stale.push(document.id);continue;}
    pending.push(document.id);
    for(const segment of document.segments)if(!state.memory[segment.hash])needed.set(segment.hash,segment);
  }
  return {pending,stale,segments:[...needed.values()],estimatedCharacters:[...needed.values()].reduce((n,s)=>n+characters(protectText(s.source).text),0)};
}
export function protectText(source){
  const tokens=[];
  let text=source;
  for(const name of protectedNames)if(text.includes(name)){
    const token=`ZXQKEEP${tokens.length}QXZ`;
    text=text.split(name).join(token);tokens.push({token,name});
  }
  return {text,restore(value){
    for(const {token,name} of tokens){
      if(value.split(token).length!==text.split(token).length)throw Object.assign(new Error('TRANSLATION_PROTECTED_TOKEN_INVALID'),{status:422});
      value=value.split(token).join(name);
    }
    return value;
  }};
}
export function batches(segments){
  const result=[];let batch=[];let count=0;
  for(const segment of segments){
    const protectedText=protectText(segment.source);const size=characters(protectedText.text);
    if(size>5000)throw new Error('TRANSLATION_SEGMENT_TOO_LONG: split the source paragraph (maximum 5000 code points).');
    if(batch.length && (batch.length>=100 || count+size>5000)){result.push(batch);batch=[];count=0;}
    batch.push({...segment,protectedText});count+=size;
  }
  if(batch.length)result.push(batch);
  return result;
}
export function usage(state,limit=DEFAULT_LIMIT,now=new Date()){
  const month=monthKey(now);const entry=state.months[month] ||= {used:0,requests:[],alerted:[]};
  return {month,used:entry.used,limit,percent:Math.round(entry.used/limit*10000)/100,remaining:Math.max(0,limit-entry.used),translatedContents:Object.values(state.documents).filter(d=>['translated','reviewed'].includes(d.status)).length,date:now.toISOString()};
}
export async function syncDocuments({documents,state,request,persist,limit=DEFAULT_LIMIT,now=()=>new Date(),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))}){
  if(!Number.isSafeInteger(limit)||limit<=0||limit>DEFAULT_LIMIT)throw new Error('TRANSLATION_LIMIT_INVALID: raising the 400000 ceiling requires an explicit code/configuration review.');
  const plan=planDocuments(documents,state);
  for(const id of plan.stale)state.documents[id].status='stale';
  const current=usage(state,limit,now());
  if(plan.estimatedCharacters>current.remaining){
    state.lastBlock={date:now().toISOString(),reason:'MONTHLY_LIMIT',estimated:plan.estimatedCharacters,...current};await persist('blocked');throw new Error('TRANSLATION_MONTHLY_LIMIT');
  }
  for(const batch of batches(plan.segments)){
    const q=batch.map(s=>s.protectedText.text);const count=q.reduce((n,text)=>n+characters(text),0);
    let translated;
    for(let attempt=0;attempt<3;attempt++){
      const date=now();const status=usage(state,limit,date);
      if(count>status.remaining){state.lastBlock={reason:'MONTHLY_LIMIT_RETRY',...status};await persist('blocked');throw new Error('TRANSLATION_MONTHLY_LIMIT');}
      const month=state.months[status.month];
      const reservation={id:randomUUID(),characters:count,date:date.toISOString(),status:'reserved',attempt:attempt+1};
      month.used+=count;month.requests.push(reservation);
      const alerts=[50,75,90,100].filter(level=>month.used>=limit*level/100&&!month.alerted.includes(level));
      for(const level of alerts){month.alerted.push(level);(state.alerts ||= []).push({level,...usage(state,limit,date)});}
      // Must durably commit/push the reservation before any network request. Never refund uncertainty.
      await persist('reservation');
      try {
        translated=await request(q);
        if(!Array.isArray(translated)||translated.length!==q.length||translated.some(text=>typeof text!=='string'||!text.trim()))throw Object.assign(new Error('TRANSLATION_RESPONSE_INVALID'),{status:502});
        translated=translated.map((text,index)=>batch[index].protectedText.restore(text));
        reservation.status='received';
        break;
      }catch(error){
        reservation.status='uncertain';
        const status=Number(error.status)||0;
        state.failures.push({date:now().toISOString(),code:status||'NETWORK_OR_VALIDATION',requestId:reservation.id});state.failures=state.failures.slice(-30);
        await persist('failure');
        // 403 is deliberately never retried: daily quota and permission errors need owner attention.
        if(attempt===2 || (status && status!==429 && status<500))throw new Error(`TRANSLATION_REQUEST_FAILED (${status||'NETWORK_OR_VALIDATION'})`);
        await sleep(1000*2**attempt);
      }
    }
    for(let i=0;i<batch.length;i++)state.memory[batch[i].hash]={text:translated[i],engine:ENGINE,date:now().toISOString()};
    // Persist each successful batch before another request: a failed run can safely resume.
    await persist('memory');
  }
  for(const document of documents){
    if(!plan.pending.includes(document.id))continue;
    for(const segment of document.segments){const cached=state.memory[segment.hash];if(!cached)throw new Error('TRANSLATION_MEMORY_INCOMPLETE');segment.assign(cached.text);}
    const content=document.render();const old=state.documents[document.id];
    state.documents[document.id]={id:document.id,sourceLanguage:'pt-BR',targetLanguage:'en',sourceHash:document.sourceHash,version:(old?.version||0)+1,translatedAt:now().toISOString(),status:content.requiresReview?'pending-review':'translated',review:{approved:false},engine:ENGINE,...content};
  }
  if(plan.pending.length||plan.stale.length)state.lastSync=now().toISOString();delete state.lastBlock;
  await persist('complete');
  return {plan,usage:usage(state,limit,now())};
}

export async function googleTranslate(q,{key,fetchImpl=fetch,timeout=20000}={}){
  if(!key)throw new Error('GOOGLE_TRANSLATE_API_KEY_MISSING');
  let response;
  try{response=await fetchImpl('https://translation.googleapis.com/language/translate/v2',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key},body:JSON.stringify({q,source:'pt',target:'en',format:'text',model:'nmt'}),signal:AbortSignal.timeout(timeout)});}
  catch{throw new Error('TRANSLATION_NETWORK_ERROR');}
  if(!response.ok)throw Object.assign(new Error('TRANSLATION_HTTP_ERROR'),{status:response.status});
  const result=await response.json().catch(()=>null);
  return result?.data?.translations?.map(item=>item.translatedText);
}
