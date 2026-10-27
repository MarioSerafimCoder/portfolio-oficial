import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file,imports){const module={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{module,exports:module.exports,require:name=>{if(name in imports)return imports[name];throw Error(name)}},{filename:file});return module.exports;}
const manifest={site:true,posts:['article','exemplo-de-leitura'],categories:['processo']};
const routes=load('src/i18n/routes.ts',{'./manifest.json':manifest});
test('localized routes preserve indexed Portuguese URLs and corresponding article',()=>{
 assert.equal(routes.languagePeer('/','en'),'/en');assert.equal(routes.languagePeer('/sobre','en'),'/en/about');
 assert.equal(routes.languagePeer('/projetos/amazonita','en'),'/en/projects/amazonita');assert.equal(routes.languagePeer('/blog/article','en'),'/en/blog/article');
 assert.equal(routes.languagePeer('/en/blog/article','pt'),'/blog/article');assert.equal(routes.languagePeer('/en/about','pt'),'/sobre');
});
test('untranslated article has no fabricated route, canonical or home redirect',()=>{
 assert.equal(routes.languagePeer('/blog/untranslated','en'),undefined);assert.equal(routes.localizedHref('/blog/untranslated','en'),'/blog/untranslated');
 assert.equal(routes.languagePeer('/blog/categoria/tecnologia','en'),undefined);assert.equal(routes.languagePeer('/blog/categoria/processo','en'),'/en/blog/category/processo');
});
test('internal links localize and retain fragments, queries, assets and external destinations',()=>{
 assert.equal(routes.localizedHref('/sobre#processo','en'),'/en/about#processo');assert.equal(routes.localizedHref('/blog?q=design#list','en'),'/en/blog?q=design#list');
 for(const path of ['/media/test.webp','#contato','https://example.com','mailto:hello@example.com'])assert.equal(routes.localizedHref(path,'en'),path);
});
test('URL locale wins; a stored preference cannot change a shared link',()=>{
 assert.equal(routes.localeFromPath('/en/about'),'en');assert.equal(routes.localeFromPath('/sobre'),'pt');assert.equal(routes.localeFromPath('/enough'),'pt');
 const provider=fs.readFileSync('src/components/journal-preferences.tsx','utf8');assert.ok(!provider.includes("getItem('ms-journal-lang')"));assert.ok(!provider.includes("getItem('ms-site-lang')"));
});
test('dictionary and templates translate rendered messages without changing form values or React elements',()=>{
 const translations=load('src/i18n/translate.ts',{'./en/site.json':{'Nome':'Name','Projetos':'Projects','Conversar pelo WhatsApp':'Chat on WhatsApp'},'./routes':routes,'./templates.json':JSON.parse(fs.readFileSync('src/i18n/templates.json','utf8'))});
 const {i18nText}=translations.createTranslator('en');assert.equal(i18nText(' Nome '),' Name ');assert.equal(i18nText('Etapa 2 de 2'),'Step 2 of 2');assert.equal(i18nText('LinkedIn de Mário Serafim (abre em nova aba)'),'LinkedIn by Mário Serafim (opens in a new tab)');
 const element={type:'input',props:{value:'Nome'}};assert.equal(i18nText(element),element);assert.equal(translations.createTranslator('pt').i18nText('Nome'),'Nome');
});
test('metadata has independent canonical, hreflang, x-default and localized Open Graph',()=>{
 const seo=load('src/i18n/metadata.ts',{'./routes':routes,'./translate':{translateObject:value=>value}});
 const pt=seo.localizedMetadata({title:'Article'},'/blog/article','pt');const en=seo.localizedMetadata({title:'Article'},'/blog/article','en');
 assert.equal(pt.alternates.canonical,'/blog/article');assert.equal(en.alternates.canonical,'/en/blog/article');assert.equal(en.alternates.languages['pt-BR'],'/blog/article');assert.equal(en.alternates.languages.en,'/en/blog/article');assert.equal(en.alternates.languages['x-default'],'/blog/article');assert.equal(en.openGraph.locale,'en_US');assert.equal(pt.openGraph.locale,'pt_BR');
 const unavailable=seo.localizedMetadata({title:'Original'},'/blog/untranslated','pt');assert.equal(unavailable.alternates.languages.en,undefined);
});
