import test from 'node:test';
import assert from 'node:assert/strict';
import {fromMarkdown} from 'mdast-util-from-markdown';
import {toMarkdown} from 'mdast-util-to-markdown';
import {editorialMarkdown} from '../src/lib/editorial-composer.ts';
import {editorialBlock} from '../src/lib/editorial-block.ts';
const draft=(kind,extra={})=>({kind,text:'Uma ideia.\n\nOutro parágrafo.',author:'',source:'',url:'',...extra});
const plain=n=>n.value||n.children?.map(plain).join('')||'';
for(const kind of ['quote','impact','author'])test(`visual composer generates ${kind} compatible with three Markdown roundtrips`,()=>{
 let {markdown,error}=editorialMarkdown(draft(kind));assert.equal(error,undefined);assert.ok(markdown.startsWith(`> [!${kind.toUpperCase()}]\n>\n`));
 for(let pass=0;pass<3;pass++){
  const tree=fromMarkdown(markdown),block=editorialBlock(tree.children[0]);
  assert.equal(tree.children.length,1);assert.equal(block.kind,kind);assert.equal(block.body.length,2);
  assert.equal(plain(block.body[0]),'Uma ideia.');assert.equal(plain(block.body[1]),'Outro parágrafo.');assert.equal(block.attribution,undefined);
  markdown=toMarkdown(tree);
 }
});
test('composer preserves literal punctuation and HTML without converting plain text into formatting',()=>{
 const value='**literal** [texto](javascript:alert(1)) <script>alert(1)</script> # título';
 const {markdown}=editorialMarkdown(draft('author',{text:value}));
 const block=editorialBlock(fromMarkdown(markdown).children[0]);assert.equal(plain(block.body[0]),value);
 assert.ok(block.body[0].children.every(n=>n.type==='text'));assert.equal(block.body.length,1);
});
test('quote author, source label and URL survive without manual Markdown',()=>{
 const {markdown}=editorialMarkdown(draft('quote',{author:'Pessoa de teste',source:'Livro [edição]',url:'https://example.com/book_(2026)?q=design'}));
 const block=editorialBlock(fromMarkdown(markdown).children[0]);assert.equal(block.body.length,2);
 assert.equal(plain(block.attribution),'— Pessoa de teste, Livro [edição]');assert.equal(block.attribution.children.find(n=>n.type==='link').url,'https://example.com/book_(2026)?q=design');
});
test('source-only quotes get a caption; other block references stay in the body',()=>{
 for(const kind of ['quote','impact','author']){
  const {markdown}=editorialMarkdown(draft(kind,{url:'https://example.com'}));const block=editorialBlock(fromMarkdown(markdown).children[0]);
  if(kind==='quote'){assert.equal(plain(block.attribution),'— Fonte');assert.equal(block.body.length,2);}
  else{assert.equal(block.attribution,undefined);assert.equal(plain(block.body.at(-1)),'Fonte');}
 }
});
test('unsafe or incomplete reference URLs block copying instead of changing saved syntax',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,hello','//example.com','example.com','https://']){
  const result=editorialMarkdown(draft('quote',{url}));assert.equal(result.markdown,'');assert.ok(result.error);
 }
});
test('empty content stays empty and CRLF paragraphs normalize without losing text',()=>{
 assert.deepEqual(editorialMarkdown(draft('impact',{text:' \n '})),{markdown:''});
 const {markdown}=editorialMarkdown(draft('author',{text:'Antes.\r\n\r\nDepois.'}));const block=editorialBlock(fromMarkdown(markdown).children[0]);
 assert.deepEqual(block.body.map(plain),['Antes.','Depois.']);
});
test('ambiguous final quote credit is caught; explicit author resolves it',()=>{
 assert.ok(editorialMarkdown(draft('quote',{text:'Primeiro.\n\n— Segundo.'})).error);
 const {markdown}=editorialMarkdown(draft('quote',{text:'Primeiro.\n\n— Segundo.',author:'Autoria'}));
 const block=editorialBlock(fromMarkdown(markdown).children[0]);assert.equal(block.body.length,2);assert.equal(plain(block.attribution),'— Autoria');
});
