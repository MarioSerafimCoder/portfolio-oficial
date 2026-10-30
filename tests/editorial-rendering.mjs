// Run against the temporary QA route; no production content is written.
import puppeteer from 'puppeteer-core';
import {mkdir,writeFile,readFile,cp,mkdtemp,symlink,rm} from 'node:fs/promises';
import {spawn,execFileSync} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
const out=process.env.EDITORIAL_EVIDENCE_DIR||'tmp/editorial-rendering';
await mkdir(out,{recursive:true});
let appDir,server;
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3014';
if(!process.env.TEST_ORIGIN){
 await mkdir('tmp',{recursive:true});
 appDir=await mkdtemp(path.resolve('tmp/cms-editorial-render-'));
 await cp('src',path.join(appDir,'src'),{recursive:true});
 for(const file of ['package.json','tsconfig.json','next.config.ts'])await cp(file,path.join(appDir,file));
 for(const dir of ['node_modules','public'])await symlink(path.resolve(dir),path.join(appDir,dir),'junction');
 for(const parent of ['(pt)','(en)/en']){
  const route=path.join(appDir,'src/app',parent,'blog/cms-editorial-qa-local');
  await mkdir(route,{recursive:true});
  await writeFile(path.join(route,'page.tsx'),await readFile('tests/fixtures/editorial-qa-page.tsx.txt'));
 }
 await mkdir(path.join(appDir,'tests/fixtures'),{recursive:true});
 await cp('tests/fixtures/editorial-blocks.md',path.join(appDir,'tests/fixtures/editorial-blocks.md'));
 server=spawn(process.execPath,[path.resolve('node_modules/next/dist/bin/next'),'dev','--hostname','127.0.0.1','--port','3014'],{cwd:appDir,stdio:['ignore','pipe','pipe'],windowsHide:true});
}
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
try{
 if(server)await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('Isolated Next server did not start')),30000);
  server.stdout.on('data',chunk=>{if(chunk.toString().includes('Ready')){clearTimeout(timer);resolve();}});
  server.on('exit',code=>{clearTimeout(timer);reject(new Error(`Next exited: ${code}`));});
 });
 for(const locale of ['pt','en'])for(const width of [1440,390,320])for(const theme of ['light','dark']){
  const page=await browser.newPage(); const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.setViewport({width,height:1000,deviceScaleFactor:1});
  await page.evaluateOnNewDocument(t=>{
   localStorage.setItem('ms-theme',t);
   localStorage.setItem('ms-privacy-consent-v1',JSON.stringify({essential:true,analytics:false,consentGiven:true,updatedAt:new Date().toISOString()}));
  },theme);
  const response=await page.goto(`${origin}${locale==='en'?'/en':''}/blog/cms-editorial-qa-local`,{waitUntil:'domcontentloaded',timeout:90000});
  assert.equal(response.status(),200);
  assert.ok((await response.text()).includes('class="editorial-quote"'),'editorial quote is server-rendered');
  await page.waitForSelector('.editorial-author');
  await page.waitForFunction(t=>document.documentElement.dataset.theme===t,{},theme);
  await page.evaluate(()=>document.fonts.ready);
  await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
  const data=await page.evaluate(async()=>{
   const root=document.querySelector('.journal-article-content');
   const selectors=['figure.editorial-quote > blockquote','.editorial-impact','aside.editorial-author[role="note"]'];
   const blocks=selectors.map(selector=>{const node=root.querySelector(selector),s=getComputedStyle(node),r=node.getBoundingClientRect();return{selector,text:node.textContent,font:getComputedStyle(node.querySelector('p')).fontSize,lineHeight:getComputedStyle(node.querySelector('p')).lineHeight,width:r.width,left:r.left,right:r.right,padding:s.padding,margin:s.margin,background:s.backgroundColor};});
   const audit=await axe.run(root,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
   const pre=root.querySelector('pre');pre.focus();
   return{theme:document.documentElement.dataset.theme,authorLabel:root.querySelector('.editorial-author-label')?.textContent,codeKeyboardFocusable:document.activeElement===pre,blocks,overflow:document.documentElement.scrollWidth>innerWidth,links:[...root.querySelectorAll('a')].map(a=>({text:a.textContent,href:a.getAttribute('href')})),strong:root.querySelectorAll('strong').length,caption:root.querySelector('.editorial-quote figcaption')?.textContent,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.html)})),rawHtmlLiteral:root.textContent.includes("<script>alert('unsafe')</script>")};
  });
  await page.screenshot({path:`${out}/${locale}-${width}-${theme}.png`,fullPage:true});
  results.push({locale,width,...data,errors});
  await page.close();
 }
 await writeFile(`${out}/rendering.json`,JSON.stringify(results,null,2));
 for(const r of results){assert.equal(r.authorLabel,r.locale==='en'?'AUTHOR’S NOTE':'NOTA DO AUTOR');assert.ok(r.codeKeyboardFocusable);assert.equal(r.overflow,false,`${r.width} ${r.theme} overflow`);assert.equal(r.violations.length,0,JSON.stringify(r.violations));assert.equal(r.errors.length,0,JSON.stringify(r.errors));assert.equal(r.strong,3);assert.ok(r.caption.includes('Autoria de teste'));assert.ok(r.rawHtmlLiteral);assert.equal(r.links.length,3);}
 console.log(`PASS: ${results.length} viewport/theme combinations; semantic HTML, links, bold, literal HTML, no overflow, no WCAG A/AA violations in article content.`);
}finally{
 await browser.close();
 if(server?.pid){
  if(process.platform==='win32')execFileSync('taskkill',['/pid',String(server.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});
  else server.kill();
 }
 if(appDir){
  assert.ok(appDir.startsWith(path.resolve('tmp')+path.sep+'cms-editorial-render-'));
  // Unlink junctions before recursive cleanup; these point to existing project assets.
  const {unlink,lstat}=await import('node:fs/promises');
  for(const name of ['node_modules','public']){
   const link=path.join(appDir,name);
   assert.ok((await lstat(link)).isSymbolicLink());
   await unlink(link);
  }
  await rm(appDir,{recursive:true,force:true,maxRetries:5,retryDelay:300});
 }
}
