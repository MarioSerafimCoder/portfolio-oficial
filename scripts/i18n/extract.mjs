import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {fileURLToPath} from 'node:url';

const excluded=new Set(['journal-generated.json','journal.ts','journal-demo-en.ts','journal-i18n.ts','media-dimensions.json']);
const technicalAttributes=new Set(['className','id','key','href','src','action','type','name','role','htmlFor','viewBox','d','style','sizes','data-motion','aria-controls','aria-labelledby','aria-describedby','aria-live','autoComplete','method','rel','target','loading','fill','stroke','fontFamily']);
const publicAttributes=new Set(['alt','title','placeholder','aria-label','caption','label','context']);
export function extractSiteStrings(root=process.cwd()){
 const found=new Set();
 function walkFiles(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){if(!['en','i18n'].includes(entry.name))walkFiles(file);continue;}
  if(!/\.tsx?$/.test(entry.name)||excluded.has(entry.name))continue;
  const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  function add(text){text=text.replace(/\s+/g,' ').trim();if(!text||!/[A-Za-zÀ-ÿ]/.test(text))return;if(/^[\/@#]|^\.[a-z-]|^\((?:hover|pointer|max-width|min-width|prefers-)/.test(text)||/^(https?:|mailto:|var\(|calc\(|translate|rotate|scale|rgb|--|application\/|top |bottom |center |\d+px )/i.test(text)||['use client','afterInteractive','lazyOnload','noopener noreferrer','pt-BR'].includes(text))return;found.add(text);}
  function visit(node){
   if(ts.isJsxText(node))add(node.text);
   if(ts.isStringLiteralLike(node)){
    const parent=node.parent;
    if(ts.isJsxAttribute(parent)){if(publicAttributes.has(parent.name.getText()))add(node.text);}
    else if((ts.isCallExpression(parent)&&parent.expression.getText(source)==='i18nText') || (ts.isArrayLiteralExpression(parent)&&/^[A-ZÀ-Ý]/.test(node.text)) || (!ts.isImportDeclaration(parent)&&!ts.isExportDeclaration(parent)&&!ts.isImportSpecifier(parent)&&!ts.isLiteralTypeNode(parent)&&!ts.isPropertyAssignment(parent)&&(/[áàâãéêíóôõúç]/i.test(node.text)||/^[A-ZÀ-Ý][\s\S]*\s[A-Za-zÀ-ÿ]/.test(node.text))) || (ts.isPropertyAssignment(parent)&&['title','description','text','line','scope','question','answer','label','body','name','discipline','industry','headline','coverAlt','context','challenge','objective','role','decisions','system','result','nature','credits','alt','caption'].includes(parent.name.getText().replace(/['"]/g,'')))){
     add(node.text);
    }
   }
   ts.forEachChild(node,visit);
  }
  visit(source);
 }}
 for(const dir of ['src/app','src/components','src/content','src/views'])if(fs.existsSync(path.join(root,dir)))walkFiles(path.join(root,dir));
 return Object.fromEntries([...found].sort().map(value=>[value,value]));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const source=extractSiteStrings();fs.mkdirSync('src/i18n/source',{recursive:true});fs.writeFileSync('src/i18n/source/site.json',JSON.stringify(source,null,2)+'\n');console.log(`Site: ${Object.keys(source).length} strings catalogadas.`);
}
