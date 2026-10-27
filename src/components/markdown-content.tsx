'use client';
import {createElement,type ReactNode} from 'react';
import Image from 'next/image';
import type {MarkdownNode} from '@/content/journal';
import {useSiteTranslation} from '@/i18n/use-translation';

/** Render the parsed source tree: formatting and code never pass through string substitution. */
export function MarkdownContent({tree,title}:{tree:MarkdownNode;title:string}){
 const {i18nHref}=useSiteTranslation();const headings=new Map<string,number>();
 const text=(node:MarkdownNode):string=>node.value||node.children?.map(text).join('')||'';
 const definitions=new Map<string,MarkdownNode>();
 for(const node of tree.children||[])if(node.type==='definition'&&node.identifier)definitions.set(node.identifier.toLowerCase(),node);
 const safeUrl=(url='')=>/^(?:https?:|mailto:|\/|#)/i.test(url)&&!url.startsWith('//')?i18nHref(url):undefined;
 function render(node:MarkdownNode,key:number|string):ReactNode{
  const children=node.children?.map((child,index)=>render(child,index));
  switch(node.type){
   case 'root':return children;
   case 'text':return node.value;
   case 'paragraph':return node.children?.length===1&&node.children[0].type==='image'?render(node.children[0],key):<p key={key}>{children}</p>;
   case 'heading':{
    if(node.depth===1&&text(node)===title)return null;
    const base=text(node).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';
    const count=(headings.get(base)||0)+1;headings.set(base,count);
    return createElement(`h${Math.min(6,node.depth||2)}`,{key,id:count===1?base:`${base}-${count}`},children);
   }
   case 'strong':return <strong key={key}>{children}</strong>;
   case 'emphasis':return <em key={key}>{children}</em>;
   case 'inlineCode':return <code key={key}>{node.value}</code>;
   case 'code':return <pre key={key}><code data-language={node.lang||undefined}>{node.value}</code></pre>;
   case 'blockquote':return <blockquote key={key}>{children}</blockquote>;
   case 'list':return node.ordered?<ol key={key} start={node.start||undefined}>{children}</ol>:<ul key={key}>{children}</ul>;
   case 'listItem':return <li key={key}>{children}</li>;
   case 'break':return <br key={key}/>;
   case 'thematicBreak':return <hr key={key}/>;
   case 'link':case 'linkReference':{
    const destination=node.type==='link'?node:definitions.get(node.identifier?.toLowerCase()||'');const href=safeUrl(destination?.url);
    return href?<a key={key} href={href} title={destination?.title||undefined} {...(/^https?:/.test(href)?{target:'_blank',rel:'noopener noreferrer'}:{})}>{children}</a>:children;
   }
   case 'image':case 'imageReference':{
    const destination=node.type==='image'?node:definitions.get(node.identifier?.toLowerCase()||'');const src=safeUrl(destination?.url);
    return src?<figure key={key}><Image src={src} alt={node.alt||''} width={1200} height={800} sizes="(max-width:700px) 100vw, 740px"/>{destination?.title&&<figcaption>{destination.title}</figcaption>}</figure>:null;
   }
   // Raw HTML/MDX is retained as literal source, never executed as visitor code.
   case 'html':return <pre key={key}><code>{node.value}</code></pre>;
   case 'definition':return null;
   default:return children||node.value||null;
  }
 }
 return render(tree,'root');
}
