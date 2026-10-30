import test from 'node:test';
import assert from 'node:assert/strict';
import {fromMarkdown} from 'mdast-util-from-markdown';
import {toMarkdown} from 'mdast-util-to-markdown';
import {readFileSync} from 'node:fs';
import {editorialBlock} from '../src/lib/editorial-block.ts';
for (const kind of ['QUOTE','IMPACT','AUTHOR']) test(`${kind} survives repeated Markdown save/reopen`,()=>{
 let source = `Before.\n\n> [!${kind}]\n>\n> An **important** idea with a [source](https://example.com).\n>\n> — Writer, Book\n\nAfter.\n`;
 for(let i=0;i<3;i++){
  const tree=fromMarkdown(source); const block=editorialBlock(tree.children[1]);
  assert.equal(block.kind,kind.toLowerCase());
  assert.ok(block.body[0].children.some(n=>n.type==='strong'));
  assert.ok(block.body[0].children.some(n=>n.type==='link'));
  if(kind==='QUOTE')assert.ok(block.attribution);
  assert.equal(tree.children[0].children[0].value,'Before.');
  assert.equal(tree.children[2].children[0].value,'After.');
  source=toMarkdown(tree);
 }
});
test('unknown, plain, incomplete and same-paragraph markers retain normal fallback',()=>{
 for(const source of ['> Ordinary quote','> [!UNKNOWN]\n>\n> Content','> [!QUOTE]','> [!AUTHOR]\n> Same paragraph'])assert.equal(editorialBlock(fromMarkdown(source).children[0]),null);
});
test('markers escaped by the Pages CMS Markdown serializer still render as editorial blocks',()=>{
 for(const kind of ['QUOTE','IMPACT','AUTHOR']){
  const tree=fromMarkdown(`> \\[!${kind}\\]\n>\n> Preserved **text** and [link](/blog).`);
  const block=editorialBlock(tree.children[0]);
  assert.equal(block?.kind,kind.toLowerCase());
  assert.equal(block.body[0].children[1].type,'strong');
  assert.equal(block.body[0].children[3].type,'link');
 }
});
test('recognition is immutable and preserves HTML as an AST node, never executable markup',()=>{
 const tree=fromMarkdown('> [!AUTHOR]\n>\n> <script>alert(1)</script>');
 const snapshot=JSON.stringify(tree); const block=editorialBlock(tree.children[0]);
 assert.equal(block.body[0].type,'html');
 assert.equal(JSON.stringify(tree),snapshot);
});
test('full article fixture survives Markdown save/reopen without losing surrounding content',()=>{
 let source=readFileSync('tests/fixtures/editorial-blocks.md','utf8');
 for(let pass=0;pass<3;pass++){
  const tree=fromMarkdown(source);
  const blocks=tree.children.map(editorialBlock).filter(Boolean);
  assert.deepEqual(blocks.map(block=>block.kind),['quote','impact','author','author']);
  assert.ok(tree.children.some(node=>node.type==='list'));
  assert.ok(tree.children.some(node=>node.type==='blockquote'&&editorialBlock(node)===null));
  assert.ok(source.includes('[link interno](/blog)'));
  assert.ok(source.includes('**negrito**'));
  source=toMarkdown(tree);
 }
});

test('actual hosted Pages CMS output preserves all editorial content in the frontend',()=>{
 const source=readFileSync('tests/fixtures/editorial-pages-cms-roundtrip.md','utf8');
 const tree=fromMarkdown(source);
 const blocks=tree.children.map(editorialBlock).filter(Boolean);
 assert.deepEqual(blocks.map(b=>b.kind),['quote','impact','author']);
 assert.equal(blocks[0].body.length,2);
 assert.equal(blocks[2].body.length,2);
 assert.ok(blocks[0].attribution);
 const credit=blocks[0].attribution.children;
 assert.equal(credit.find(n=>n.type==='link').url,'https://example.com/source');
 for(const block of blocks){
  assert.ok(block.body[0].children.some(n=>n.type==='strong'));
  assert.ok(block.body[0].children.some(n=>n.type==='link'));
 }
 assert.ok(source.includes('Edicao visual 2.'));
 assert.ok(source.includes('Edicao visual 3.'));
});
