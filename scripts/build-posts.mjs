import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {marked} from 'marked';
import {parseYaml, publicationTime} from '../cloudflare/publication.mjs';
import {prepareDocument} from './i18n/core.mjs';
import {markdownTree} from './i18n/markdown.mjs';

const root=path.join(process.cwd(),'src/content/posts');
const categories=new Set(['identidade-visual','branding','direcao-de-arte','processo','tecnologia','referencias']);
const blocksFrom=(tokens)=>tokens.flatMap(token=>{
  if(token.type==='heading' && (token.depth===2||token.depth===3))return [{type:'heading',level:token.depth,text:token.text}];
  if(token.type==='paragraph'){
    if(token.tokens?.length===1 && token.tokens[0].type==='image')return [imageFrom(token.tokens[0])];
    const segments=[];
    for(const part of token.tokens||[]){if(part.type==='link')segments.push({text:part.text,href:part.href});else if(part.type==='image')segments.push({text:part.text||part.href});else if(part.type==='text'||part.type==='escape'||part.type==='strong'||part.type==='em'||part.type==='codespan')segments.push({text:part.text});else if(part.type==='br')segments.push({text:' '});}
    return [{type:'paragraph',segments:segments.length?segments:[{text:token.text}]}];
  }
  if(token.type==='list')return [{type:'list',items:token.items.map(item=>item.text.replace(/\s+/g,' ').trim())}];
  if(token.type==='blockquote')return [{type:'quote',text:token.text}];
  if(token.type==='image')return [imageFrom(token)];
  return [];
});
function imageFrom(token){return {type:'image',src:token.href,alt:token.text||'',width:1200,height:800,caption:token.title||undefined};}
const posts=[];
const translationFile=path.join(process.cwd(),'src/i18n/en/posts.json');
const translations=fs.existsSync(translationFile)?JSON.parse(fs.readFileSync(translationFile,'utf8')):{};
for(const filename of fs.readdirSync(root).filter(name=>name.endsWith('.md')).sort()){
  const slug=filename.slice(0,-3);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug==='exemplo-de-leitura')throw Error(`Slug inválido ou reservado: ${slug}`);
  const {data,content}=matter(fs.readFileSync(path.join(root,filename),'utf8'), {engines: {yaml: parseYaml}});
  if(!data.title||!data.summary||!categories.has(data.category)||!['draft','published'].includes(data.status))throw Error(`Metadados inválidos: ${filename}`);
  if(data.demo!==undefined&&typeof data.demo!=='boolean')throw Error(`demo deve ser true ou false: ${filename}`);
  if(data.tags!==undefined&&(!Array.isArray(data.tags)||data.tags.some(tag=>typeof tag!=='string'||!tag.trim())))throw Error(`tags deve ser uma lista de textos: ${filename}`);
  let date='';let publishAt;
  if(data.publish_at){
    try { publishAt=publicationTime(data.publish_at); }
    catch { throw Error(`publish_at inválido: ${filename}`); }
    date=publishAt.slice(0,10);
  }
  if(data.status==='published'&&!publishAt)throw Error(`Artigo publicado sem publish_at: ${filename}`);
  if(data.status!=='published'||Date.parse(publishAt)>Date.now())continue;
  if(data.cover && !String(data.cover).startsWith('/media/blog/'))throw Error(`Imagem de capa inválida: ${filename}`);
  const coverPosition=String(data.cover_position||'').trim();
  if(coverPosition&&!/^(?:(?:left|center|right|\d{1,3}%)(?:\s+(?:top|center|bottom|\d{1,3}%))?|(?:top|center|bottom))$/.test(coverPosition))throw Error(`cover_position inválido: ${filename}`);
  const translation=translations[slug];
  const validTranslation=translation&&translation.sourceHash===prepareDocument({id:`post:${slug}`,data,body:content}).sourceHash;
  posts.push({slug,title:data.title,summary:data.summary,category:data.category,status:'published',date,publishAt,...(data.demo?{demo:true}:{}),...(data.tags?.length?{tags:data.tags.map(tag=>tag.trim())}:{}),seo:{title:data.seo_title||undefined,description:data.seo_description||undefined},cover:data.cover?{src:data.cover,alt:data.cover_alt||data.title,width:1200,height:800,position:coverPosition||undefined}:undefined,content:blocksFrom(marked.lexer(content)),markdownTree:markdownTree(content),...(validTranslation?{translations:{en:{title:translation.title,summary:translation.summary,seo:{title:translation.seo_title||translation.title,description:translation.seo_description||translation.summary},coverAlt:translation.cover_alt||translation.title,...(translation.tags?.length?{tags:translation.tags}:{}),content:blocksFrom(marked.lexer(translation.body)),markdownTree:markdownTree(translation.body,content)}}}:{})});
}
fs.writeFileSync('src/content/journal-generated.json',JSON.stringify(posts,null,2)+'\n');
console.log(`Posts publicados no build: ${posts.length}`);
