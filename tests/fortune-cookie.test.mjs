import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createFortuneDrawer, fortuneCookieStorageKey} from '../src/lib/fortune-cookie-draw.ts';

const catalog = JSON.parse(readFileSync(new URL('../src/content/fortune-cookie-phrases.json', import.meta.url), 'utf8'));
const ids = catalog.map(({id}) => id);

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
}

test('the catalog has distinct IDs and nonempty, distinct phrases', () => {
  assert.ok(catalog.length > 1);
  assert.equal(new Set(ids).size, catalog.length);
  assert.equal(new Set(catalog.map(({texto}) => texto)).size, catalog.length);
  assert.ok(catalog.every(({id, texto}) => id.trim() && texto.trim()));
});

test('all phrases are drawn once even when the drawer is recreated', () => {
  const storage = memoryStorage();
  const draws = ids.map(() => createFortuneDrawer(() => storage)(ids));
  assert.deepEqual(new Set(draws), new Set(ids));
  assert.deepEqual(JSON.parse(storage.getItem(fortuneCookieStorageKey)), {remaining: [], used: draws});
});

test('a renewed cycle avoids immediately repeating the previous final phrase', () => {
  const storage = memoryStorage();
  const smallCatalog = ['a', 'b'];
  const first = createFortuneDrawer(() => storage, () => .99);
  assert.deepEqual(smallCatalog.map(() => first(smallCatalog)), ['a', 'b']);

  const renewed = createFortuneDrawer(() => storage, () => 0);
  assert.deepEqual(smallCatalog.map(() => renewed(smallCatalog)), ['a', 'b']);
});

test('new IDs enter the current cycle and removed IDs leave without resetting history', () => {
  const storage = memoryStorage();
  const draw = createFortuneDrawer(() => storage, () => .99);
  assert.equal(draw(['a', 'b', 'c']), 'a');
  assert.equal(draw(['a', 'c', 'd']), 'c');
  assert.equal(draw(['a', 'c', 'd']), 'd');
  assert.equal(draw(['a', 'c', 'd', 'e']), 'e');
});

test('blocked storage and failed writes keep drawing from the in-memory cycle', () => {
  const blocked = createFortuneDrawer(() => { throw new Error('Blocked'); }, () => .99);
  assert.deepEqual(['a', 'b', 'c'].map(() => blocked(['a', 'b', 'c'])), ['a', 'b', 'c']);

  const storage = memoryStorage();
  const smallCatalog = ['a', 'b', 'c'];
  assert.equal(createFortuneDrawer(() => storage, () => .99)(smallCatalog), 'a');
  const writeBlocked = createFortuneDrawer(() => ({
    getItem: storage.getItem,
    setItem() { throw new Error('Quota'); },
  }));
  assert.equal(writeBlocked(smallCatalog), 'b');
  assert.equal(writeBlocked(smallCatalog), 'c');
});
