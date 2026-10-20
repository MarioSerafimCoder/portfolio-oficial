import fs from 'node:fs/promises';
import path from 'node:path';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3001';
const pages=['/','/projetos','/sobre','/blog','/blog/exemplo-de-leitura','/blog/feed.xml','/feed.xml','/contato','/privacidade','/materiais',...['amazonita','rooftop','simetria','eduardo-noronha','amanda-araujo'].map(s=>'/projetos/'+s),'/robots.txt','/sitemap.xml','/opengraph-image'];
const media=(await fs.readdir('public/media',{recursive:true,withFileTypes:true})).filter(entry=>entry.isFile()).map(entry=>'/'+path.relative('public',path.join(entry.parentPath,entry.name)).split(path.sep).join('/'));
const results=[];
for(const path of [...pages,...media]){
 const response=await fetch(origin+path);const expected=200;
 results.push({path,status:response.status,expected,pass:response.status===expected});
 await response.arrayBuffer();
}
// Com output: export, URLs dinâmicas desconhecidas dependem do servidor estático
// para retornar 404. O next dev responde 500; confira os arquivos exportados.
for(const route of ['/blog/inexistente',...['01','02','03','04','05'].map(n=>'/blog/nota-'+n)]){
 const file=path.join('out',`${route.slice(1)}.html`);
 const exists=await fs.access(file).then(()=>true,()=>false);
 results.push({path:route,status:exists?'exported':'absent',expected:'absent',pass:!exists});
}
const feed=await fs.readFile(path.join('out','blog','feed.xml'),'utf8');
results.push({path:'/blog/feed.xml',status:feed.includes('<rss version="2.0">')&&!feed.includes('exemplo-de-leitura')?'publicado-sem-demo':'invalido',expected:'publicado-sem-demo',pass:feed.includes('<rss version="2.0">')&&!feed.includes('exemplo-de-leitura')});
const demoHtml=await fs.readFile(path.join('out','blog','exemplo-de-leitura.html'),'utf8');
results.push({path:'/blog/exemplo-de-leitura',status:demoHtml.includes('noindex')&&demoHtml.includes('POST DE TESTE')?'teste-sem-indexacao':'invalido',expected:'teste-sem-indexacao',pass:demoHtml.includes('noindex')&&demoHtml.includes('POST DE TESTE')});
await fs.writeFile('docs/validation/refinement-routes.json',JSON.stringify(results,null,2));
console.log(`${results.filter(r=>r.pass).length}/${results.length} rotas e arquivos com o status esperado.`);
if(results.some(r=>!r.pass))process.exitCode=1;
