import fs from 'node:fs';
import path from 'node:path';

// Validate actual exported documents, after Next has rendered them. A component
// test cannot detect a template accidentally wrapping an entire root document.
export function validateDocument(html, file) {
 const failures=[];
 if(!/^<!doctype html>/i.test(html))failures.push('DOCTYPE must be the first bytes');
 for(const tag of ['html','head','body']){
  if((html.match(new RegExp(`<${tag}(?:\\s|>)`,'gi'))||[]).length!==1)failures.push(`expected exactly one <${tag}>`);
  if((html.match(new RegExp(`</${tag}>`,'gi'))||[]).length!==1)failures.push(`expected exactly one </${tag}>`);
 }
 const htmlStart=html.indexOf('<html');const headStart=html.indexOf('<head');const bodyStart=html.indexOf('<body');
 if(!(htmlStart>=15&&headStart>htmlStart&&bodyStart>headStart))failures.push('invalid document element order');
 // Next supplies its own noindex fallback for unmatched routes with multiple roots.
 const fallback=/^(?:404|_not-found)\.html$/.test(path.basename(file));
 if(!fallback&&!/<html\b[^>]*\blang="(?:pt-BR|en)"/i.test(html))failures.push('missing supported document language');
 if(failures.length)throw new Error(`${file}: ${failures.join('; ')}`);
}

function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve('scripts/validate-export.mjs')){
 const files=walk('out').filter(file=>file.endsWith('.html'));
 if(!files.length)throw new Error('No exported HTML documents found');
 for(const file of files)validateDocument(fs.readFileSync(file,'utf8'),file);
 console.log(`Validated ${files.length} exported HTML documents: DOCTYPE, document structure and language.`);
}
