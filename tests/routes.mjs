import fs from 'node:fs/promises';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3001';
const pages=['/','/projetos','/sobre','/contato',...['amazonita','rooftop','eduardo-noronha','amanda-araujo'].map(s=>'/projetos/'+s),'/robots.txt','/sitemap.xml','/opengraph-image'];
const media=(await fs.readdir('public/media')).map(s=>'/media/'+s);
const results=[];
for(const path of [...pages,...media,'/projetos/inexistente']){
 const response=await fetch(origin+path);const expected=path.endsWith('inexistente')?404:200;
 results.push({path,status:response.status,expected,pass:response.status===expected});
 await response.arrayBuffer();
}
await fs.writeFile('docs/validation/routes.json',JSON.stringify(results,null,2));
console.log(`${results.filter(r=>r.pass).length}/${results.length} rotas e arquivos com o status esperado.`);
if(results.some(r=>!r.pass))process.exitCode=1;
