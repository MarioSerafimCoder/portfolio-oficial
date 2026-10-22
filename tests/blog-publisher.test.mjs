import test from 'node:test';
import assert from 'node:assert/strict';
import worker, {publishDue} from '../cloudflare/scheduled-rebuild.mjs';
import {postMetadata, publicationTime} from '../cloudflare/publication.mjs';

const now = Date.parse('2026-10-22T20:20:00Z');
const silent = {log() {}, error() {}};
function setup(posts = [['published', '2026-10-22T17:20']]) {
  const kv = new Map();
  const calls = [];
  let hookStatus = 200;
  let failWrite = false;
  const env = {CLOUDFLARE_PAGES_DEPLOY_HOOK: 'https://example.invalid/test-hook', BLOG_SCHEDULER_KV: {
    get: async key => kv.get(key),
    put: async (key, value) => {if (failWrite) throw Error('storage failure'); kv.set(key, value);},
  }};
  const files = posts.map((_, index) => ({name: `post-${index}.md`, path: `src/content/posts/post-${index}.md`, type: 'file', sha: String(index)}));
  const request = async (url, options) => {
    calls.push({url, options});
    if (url === env.CLOUDFLARE_PAGES_DEPLOY_HOOK) return new Response('', {status: hookStatus});
    if (url.endsWith('/commits/main')) return Response.json({sha: 'a'.repeat(40)});
    if (url.includes('/contents/')) return Response.json(files);
    const index = Number(url.split('/').at(-1));
    const [status, publishAt] = posts[index];
    return Response.json({encoding: 'base64', content: Buffer.from(`---\ntitle: Café\nstatus: ${status}\npublish_at: ${publishAt}\n---\nText`).toString('base64')});
  };
  return {env, kv, calls, options: {request, now, log: silent}, hooks: () => calls.filter(call => call.options.method === 'POST').length,
    setStatus: value => {hookStatus = value;}, failWrite: () => {failWrite = true;}};
}

test('Fortaleza: YAML sem aspas, segundos, offset e calendário', () => {
  const data = postMetadata('---\nstatus: published\npublish_at: 2026-10-22T17:20:00\n---\n');
  assert.equal(publicationTime(data.publish_at), '2026-10-22T17:20:00-03:00');
  assert.equal(Date.parse(publicationTime('2026-10-22T17:20')), now);
  assert.equal(Date.parse(publicationTime('2026-10-22T20:20:00Z')), now);
  for (const invalid of ['', '2026-02-30T12:00', '2026-10-22', '2026-10-22T24:00', '2026-10-22T17:20:60']) {
    assert.throws(() => publicationTime(invalid));
  }
});

test('não antecipa; exclui rascunhos; um build no limite e nenhum na repetição', async () => {
  const s = setup([['published','2026-10-22T17:20'], ['published','2026-10-22T17:20:01'], ['draft','2020-01-01T12:00']]);
  assert.equal(await publishDue(s.env, {...s.options, now: now - 1}), 0);
  assert.equal(s.hooks(), 0);
  assert.equal(await publishDue(s.env, s.options), 1);
  assert.equal(await publishDue(s.env, s.options), 0);
  assert.equal(s.hooks(), 1);
  assert.equal(s.kv.size, 1);
  assert.ok(s.calls.some(call => call.url.includes(`?ref=${'a'.repeat(40)}`)));
});

test('agrupa publicações vencidas em um único build', async () => {
  const s = setup([['published','2020-01-01T12:00'], ['published','2026-10-22T17:20']]);
  assert.equal(await publishDue(s.env, s.options), 2);
  assert.equal(s.hooks(), 1);
  assert.equal(s.kv.size, 2);
});

test('hook HTTP falha sem consumir publicações e próximo Cron recupera', async () => {
  const s = setup();
  s.setStatus(503);
  await assert.rejects(publishDue(s.env, s.options), /HTTP 503/);
  assert.equal(s.kv.size, 0);
  s.setStatus(200);
  assert.equal(await publishDue(s.env, s.options), 1);
});

test('timeout do hook não expõe URL e não marca KV', async () => {
  const s = setup();
  const request = async (url, options) => {
    if (options.method === 'POST') throw Error(`failure at ${url}`);
    return s.options.request(url, options);
  };
  await assert.rejects(publishDue(s.env, {...s.options, request}), error => error.message === 'Deploy Hook indisponível; publicações continuam pendentes');
  assert.equal(s.kv.size, 0);
});

test('falhas GitHub, metadados e KV não são marcadas como sucesso', async () => {
  const s = setup();
  await assert.rejects(publishDue(s.env, {...s.options, request: async () => new Response('', {status: 403})}), /GitHub HTTP 403/);
  assert.equal(s.hooks(), 0);
  const invalid = setup([['published','2026-02-30T12:00']]);
  await assert.rejects(publishDue(invalid.env, invalid.options), /Varredura incompleta/);
  assert.equal(invalid.hooks(), 0);
  s.failWrite();
  await assert.rejects(publishDue(s.env, s.options), /KV: falha/);
  assert.equal(s.kv.size, 0);
});

test('execuções simultâneas no mesmo isolate compartilham a varredura', async () => {
  const s = setup([['published', '2020-01-01T12:00']]);
  const original = globalThis.fetch;
  globalThis.fetch = s.options.request;
  try {
    await Promise.all([worker.scheduled({}, s.env), worker.scheduled({}, s.env)]);
    assert.equal(s.hooks(), 1);
  } finally { globalThis.fetch = original; }
});

test('requisição HTTP pública nunca aciona build', async () => {
  assert.equal((await worker.fetch()).status, 200);
});
