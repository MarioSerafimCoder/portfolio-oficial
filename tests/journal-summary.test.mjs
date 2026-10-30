import test from 'node:test';
import assert from 'node:assert/strict';
import {journalSummary} from '../src/lib/journal-summary.ts';

test('summary uses article sentences and ignores image captions and headings', () => {
  const first = 'Uma identidade visual consistente conecta as decisões de design ao contexto da marca.';
  const second = 'As decisões de design ajudam a construir uma identidade visual reconhecível ao longo do tempo.';
  const result = journalSummary([{type:'heading',level:2,text:'Título'}, {type:'paragraph',text:first}, {type:'paragraph',segments:[{text:second}]}]);
  assert.equal(result, `${first} ${second}`);
});
test('summary remains bounded and supports an empty article fallback', () => {
  assert.equal(journalSummary([], 'Resumo editorial.'), 'Resumo editorial.');
  assert.equal(journalSummary([]), '');
  const result = journalSummary([{type:'paragraph',text:'Uma reflexão sobre identidade visual e percepção de marca '.repeat(20)}]);
  assert.ok(result.length <= 320);
  assert.ok(result.endsWith('…'));
});
test('summary updates with content and preserves the article language', () => {
  const content = [{type:'paragraph',text:'Visual identity helps people recognise a brand across different everyday experiences.'}];
  assert.equal(journalSummary(content), content[0].text);
  assert.notEqual(journalSummary(content), journalSummary([{type:'paragraph',text:'A identidade visual conecta uma marca às experiências das pessoas no cotidiano.'}]));
});
