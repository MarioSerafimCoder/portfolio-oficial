import dictionary from './en/site.json';
import {localizedHref,type SiteLocale} from './routes';
import templates from './templates.json';
const entries:Record<string,string>=dictionary;
const patterns=templates.map(({pt,en})=>({pattern:new RegExp('^'+pt.split(/(\{\d+\})/).map(part=>/^\{\d+\}$/.test(part)?'(.+?)':part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('')+'$'),en}));
/** Exact versioned messages; never changes DOM, user input, destinations or source data. */
export function createTranslator(locale:SiteLocale){
 const string=(value:string):string=>{
  if(locale==='pt')return value;
  const key=value.trim().replace(/\s+/g,' ');const translated=entries[key];
  if(translated!==undefined)return value.replace(value.trim(),translated);
  for(const {pattern,en} of patterns){const match=key.match(pattern);if(match)return en.replace(/\{(\d+)\}/g,(_,index)=>string(match[Number(index)+1]));}
  // Composed factual labels retain proper names, dates and separators.
  if(value.includes(' · '))return value.split(' · ').map(string).join(' · ');
  if(value.includes(' — '))return value.split(' — ').map(string).join(' — ');
  if(value.startsWith('PT / EN — '))return 'PT / EN — '+string(value.slice(10));
  return value;
 };
 const t=<T,>(value:T):T=>(typeof value==='string'?string(value):Array.isArray(value)?value.map(item=>t(item)):value) as T;
 return {i18nText:t,i18nHref:(path:string)=>localizedHref(path,locale),locale};
}
export function translateObject<T>(value:T,locale:SiteLocale):T{
 const {i18nText}=createTranslator(locale);
 if(typeof value==='string')return i18nText(value) as T;
 if(Array.isArray(value))return value.map(item=>translateObject(item,locale)) as T;
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,translateObject(item,locale)])) as T;
 return value;
}
