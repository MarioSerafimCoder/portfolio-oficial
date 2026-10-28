import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const script=path.resolve('scripts/build-posts.mjs');
function fixture(status,publishAt,demo=false){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'journal-'));fs.mkdirSync(path.join(dir,'src/content/posts'),{recursive:true});fs.writeFileSync(path.join(dir,'src/content/posts/post.md'),`---\ntitle: Post de teste\nsummary: Resumo de teste\ncategory: processo\nstatus: ${status}\n${demo?'demo: true\n':''}publish_at: "${publishAt}"\n---\n\n## Seção\n\nUm [link](https://example.com) útil.\n\n> Citação\n\n![Imagem](/media/blog/teste.png)\n`);return dir}
function run(dir){const result=spawnSync(process.execPath,[script],{cwd:dir,encoding:'utf8'});assert.equal(result.status,0,result.stderr);return JSON.parse(fs.readFileSync(path.join(dir,'src/content/journal-generated.json'),'utf8'))}
test('rascunho nunca entra na exportação',()=>{const dir=fixture('draft','2020-01-01T12:00');try{assert.equal(run(dir).length,0)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test('publicação futura não entra na exportação',()=>{const dir=fixture('published','2099-01-01T12:00');try{assert.equal(run(dir).length,0)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test('publicação vencida gera blocos editoriais e data no fuso Fortaleza',()=>{const dir=fixture('published','2020-01-01T12:00');try{const posts=run(dir);assert.equal(posts.length,1);assert.equal(posts[0].publishAt,'2020-01-01T12:00:00-03:00');assert.deepEqual(posts[0].content.map(block=>block.type),['heading','paragraph','quote','image']);assert.equal(posts[0].content[1].segments[1].href,'https://example.com')}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test('conteúdo de teste mantém a marca editorial durante a geração',()=>{const dir=fixture('published','2020-01-01T12:00',true);try{assert.equal(run(dir)[0].demo,true)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
