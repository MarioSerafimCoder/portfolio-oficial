import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const generated = [
  {slug: 'public-post', status: 'published', date: '2026-10-26', category: 'direcao-de-arte', tags: ['criatividade'], content: []},
  {slug: 'demo-post', status: 'published', date: '2026-10-25', category: 'direcao-de-arte', demo: true, content: []},
];

function loadJournal() {
  const module = {exports: {}};
  const source = fs.readFileSync('src/content/journal.ts', 'utf8');
  const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true}}).outputText;
  vm.runInNewContext(code, {module, exports: module.exports, require: name => {
    if (name === './journal-generated.json') return generated;
    if (name === './journal-demo-en') return {journalDemoEnglish: []};
    throw new Error(`Unexpected import: ${name}`);
  }}, {filename: 'src/content/journal.ts'});
  return module.exports;
}

test('test posts stay accessible by direct route but out of public listings', () => {
  const journal = loadJournal();
  assert.equal(journal.publishedJournalPosts.some(post => post.slug === 'demo-post'), false);
  assert.equal(journal.visibleJournalPosts.some(post => post.slug === 'demo-post'), true);
  assert.equal(journal.getVisibleJournalPost('demo-post').demo, true);
});

test('recommendations prefer shared tags and use newest posts as fallback', () => {
  const {relatedJournalPosts} = loadJournal();
  const current = {slug: 'current', status: 'published', date: '2026-10-28', category: 'processo', tags: ['IA'], content: []};
  const candidates = [
    {slug: 'same-category', status: 'published', date: '2026-10-27', category: 'processo', content: []},
    {slug: 'shared-tag', status: 'published', date: '2026-10-24', category: 'tecnologia', tags: ['ia'], content: []},
    {slug: 'recent', status: 'published', date: '2026-10-26', category: 'branding', content: []},
  ];
  assert.equal(relatedJournalPosts(current, candidates, 1)[0].slug, 'shared-tag');
  assert.equal(relatedJournalPosts({...current, tags: []}, candidates, 1)[0].slug, 'same-category');
  assert.equal(relatedJournalPosts({...current, category: 'identidade-visual', tags: []}, candidates, 1)[0].slug, 'same-category');
});
