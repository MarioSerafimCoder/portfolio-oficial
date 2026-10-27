import manifest from './manifest.json';
export type SiteLocale='pt'|'en';
const pages:Record<string,string>={'/':'/en','/sobre':'/en/about','/projetos':'/en/projects','/contato':'/en/contact','/blog':'/en/blog','/privacidade':'/en/privacy','/materiais':'/en/resources','/trajetoria':'/en/about'};
export const localeFromPath=(path:string):SiteLocale=>path==='/en'||path.startsWith('/en/')?'en':'pt';
export function originalPath(path:string){
 const [pathname,...suffix]=path.split(/(?=[?#])/);
 const reverse=Object.entries(pages).find(([,en])=>en===pathname)?.[0];
 const result=reverse||pathname.replace(/^\/en\/projects\//,'/projetos/').replace(/^\/en\/blog\/category\//,'/blog/categoria/').replace(/^\/en\/blog\//,'/blog/');
 return result+suffix.join('');
}
export function languagePeer(path:string,locale:SiteLocale):string|undefined{
 if(!path.startsWith('/')||path.startsWith('//'))return path;
 const source=originalPath(path);const pathname=source.split(/[?#]/)[0];const suffix=source.slice(pathname.length);
 if(locale==='pt')return source;
 if(!manifest.site)return undefined;
 if(pages[pathname])return pages[pathname]+suffix;
 if(pathname.startsWith('/projetos/'))return pathname.replace('/projetos/','/en/projects/')+suffix;
 if(pathname.startsWith('/blog/categoria/')&&(manifest.categories as string[]).includes(pathname.slice('/blog/categoria/'.length)))return pathname.replace('/blog/categoria/','/en/blog/category/')+suffix;
 if(pathname.startsWith('/blog/')&&manifest.posts.includes(pathname.slice(6)))return '/en'+pathname+suffix;
 return undefined;
}
export const localizedHref=(path:string,locale:SiteLocale)=>languagePeer(path,locale)||originalPath(path);
