import test from 'node:test';
import assert from 'node:assert/strict';
import worker, {publishDue} from '../cloudflare/scheduled-rebuild.mjs';
import {postMetadata, publicationTime} from '../cloudflare/publication.mjs';
import {githubClient} from '../cloudflare/github-client.mjs';

const now = Date.parse('2026-10-22T20:20:00Z');
const silent = {log() {}, error() {}};
function setup(posts = [['published', '2026-10-22T17:20']]) {
  const kv = new Map();
  const calls = [];
  let hookStatus = 200;
  let failWrite = false;
  let publicPage = {status: 404, html: ''};
  let publicIndex = {status: 404, html: ''};
  const env = {GITHUB_TOKEN: 'test-token-not-real', CLOUDFLARE_PAGES_DEPLOY_HOOK: 'https://example.invalid/test-hook', BLOG_SCHEDULER_KV: {
    get: async key => kv.get(key),
    put: async (key, value) => {if (failWrite) throw Error('storage failure'); kv.set(key, value);},
  }};
  const files = posts.map((_, index) => ({name: `post-${index}.md`, path: `src/content/posts/post-${index}.md`, type: 'file', sha: String(index)}));
  const request = async (url, options) => {
    calls.push({url, options});
    if (url === env.CLOUDFLARE_PAGES_DEPLOY_HOOK) return new Response('', {status: hookStatus});
    if (url === 'https://marioserafim.com.br/blog') return new Response(publicIndex.html, {status: publicIndex.status});
    if (url.startsWith('https://marioserafim.com.br/blog/')) return new Response(publicPage.html, {status: publicPage.status});
    if (url.endsWith('/commits/main')) return Response.json({sha: 'a'.repeat(40)});
    if (url.includes('/contents/')) return Response.json(files);
    const index = Number(url.split('/').at(-1));
    const [status, publishAt] = posts[index];
    return Response.json({encoding: 'base64', content: Buffer.from(`---\ntitle: Café\nstatus: ${status}\npublish_at: ${publishAt}\n---\nText`).toString('base64')});
  };
  return {env, kv, calls, options: {request, now, log: silent}, hooks: () => calls.filter(call => call.options.method === 'POST').length,
    setStatus: value => {hookStatus = value;}, failWrite: () => {failWrite = true;},
    setPublicPage: (html, status = 200) => {publicPage = {html, status};},
    setPublicIndex: (html, status = 200) => {publicIndex = {html, status};}};
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

test('falha temporária no GitHub é repetida e a varredura recupera', async () => {
  const s = setup(); let commitCalls = 0;
  const request = async (url, options) => {
    if (url.endsWith('/commits/main') && ++commitCalls === 1) throw Error('temporary network failure');
    return s.options.request(url, options);
  };
  assert.equal(await publishDue(s.env, {...s.options, request, pause: async () => {}}), 1);
  assert.equal(commitCalls, 2);
  assert.equal(s.hooks(), 1);
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
  s.kv.clear();
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

test('403 classifica rate limit, respeita reset entre Crons e não vaza token', async () => {
  const s = setup(); const logs = []; let calls = 0;
  const options = {...s.options, log: {error: value => logs.push(value)}, request: async () => {
    calls++;
    return Response.json({message: 'API rate limit exceeded'}, {status: 403,
      headers: {'x-ratelimit-remaining':'0', 'x-ratelimit-limit':'60', 'x-ratelimit-reset':String(now / 1000 + 3600)}});
  }};
  const github = await githubClient(s.env, options);
  await assert.rejects(github('commits/main'), /primary-rate-limit/);
  await assert.rejects(githubClient(s.env, options), /cooldown/);
  assert.equal(calls, 1);
  assert.ok(logs[0].includes('primary-rate-limit'));
  assert.ok(!logs[0].includes(s.env.GITHUB_TOKEN));
});

test('401 não repete; 503 repete uma vez; autenticação obrigatória', async () => {
  const s = setup(); let calls = 0; let pauses = 0;
  const github = await githubClient(s.env, {...s.options, pause: async () => {pauses++;}, request: async () => {
    calls++; return calls === 1 ? new Response('', {status: 503}) : Response.json({ok: true});
  }});
  assert.deepEqual(await github('commits/main'), {ok:true}); assert.equal(pauses, 1);
  const denied = await githubClient(s.env, {...s.options, request: async () => new Response('', {status:401})});
  await assert.rejects(denied('commits/main'), /token inválido/);
  await assert.rejects(githubClient({...s.env, GITHUB_TOKEN: undefined}, s.options), /GITHUB_TOKEN/);
});

test('resposta JSON inválida do GitHub recebe uma retentativa controlada', async () => {
  const s = setup(); let calls = 0; let pauses = 0;
  const github = await githubClient(s.env, {...s.options, pause: async () => {pauses++;}, request: async (url, options) => {
    calls++;
    return calls === 1 ? new Response('{', {status: 200}) : s.options.request(url, options);
  }});
  assert.deepEqual(await github('commits/main'), {sha: 'a'.repeat(40)});
  assert.equal(calls, 2);
  assert.equal(pauses, 1);
});

test('se o timer de backoff falhar, a segunda tentativa limitada ainda acontece', async () => {
  const s = setup(); let calls = 0;
  const github = await githubClient(s.env, {...s.options, pause: async () => {throw Error('timer unavailable');}, request: async (url, options) => {
    if (++calls === 1) throw Error('temporary network failure');
    return s.options.request(url, options);
  }});
  assert.deepEqual(await github('commits/main'), {sha: 'a'.repeat(40)});
  assert.equal(calls, 2);
});

test('falhas na leitura e gravação do cooldown do GitHub são classificadas como KV', async () => {
  const s = setup();
  const readFailure = {...s.env, BLOG_SCHEDULER_KV: {get: async () => {throw Error('read failed');}, put: async () => {}}};
  await assert.rejects(githubClient(readFailure, s.options), /KV: falha ao ler cooldown/);
  const writeFailure = {...s.env, BLOG_SCHEDULER_KV: {get: async () => null, put: async () => {throw Error('write failed');}}};
  const github = await githubClient(writeFailure, {...s.options, request: async () => Response.json({message: 'API rate limit exceeded'}, {status: 403})});
  await assert.rejects(github('commits/main'), /KV: falha ao gravar cooldown/);
});

test('hook aceito permanece pendente; página e listagem públicas confirmam sem outro build', async () => {
  const s = setup();
  await publishDue(s.env, s.options);
  assert.equal(JSON.parse([...s.kv.values()][0]).status, 'pending');
  s.setPublicPage('<title>Café — Mário Serafim</title><meta property="article:published_time" content="2026-10-22T17:20:00-03:00"/>');
  s.setPublicIndex('<a href="/blog/post-0">Café</a>');
  const request = async (url, options) => s.options.request(url, options);
  await publishDue(s.env, {...s.options, request});
  assert.equal(JSON.parse([...s.kv.values()][0]).status, 'confirmed');
  assert.equal(s.hooks(), 1);
  assert.ok(s.calls.filter(call => call.url.includes('/blog')).every(call => call.options.cache === 'no-store'));
});

test('página antiga com mesmo título e horário diferente não confirma publicação', async () => {
  const s = setup();
  s.setPublicPage('<title>Café — Mário Serafim</title><meta property="article:published_time" content="2026-10-22T17:18:00-03:00"/>');
  s.setPublicIndex('<a href="/blog/post-0">Café</a>');
  await publishDue(s.env, s.options);
  assert.equal(s.hooks(), 1);
  assert.equal(JSON.parse([...s.kv.values()][0]).status, 'pending');
});

test('estado confirmado antigo é reaberto quando a publicação atual está ausente', async () => {
  const s = setup();
  const key = `publication:v1:${encodeURIComponent('src/content/posts/post-0.md')}:${now}`;
  s.kv.set(key, JSON.stringify({status: 'confirmed', confirmedAt: new Date(now - 60000).toISOString()}));
  s.setPublicPage('<title>Café — Mário Serafim</title><meta property="article:published_time" content="2026-10-22T17:18:00-03:00"/>');
  s.setPublicIndex('<a href="/blog/post-0">Café</a>');
  await publishDue(s.env, s.options);
  assert.equal(s.hooks(), 1);
  assert.deepEqual(JSON.parse(s.kv.get(key)), {
    status: 'pending', attempts: 1, commit: 'a'.repeat(40),
    requestedAt: new Date(now).toISOString(), publishAt: '2026-10-22T17:20:00-03:00',
  });
});

test('página atual sem link no índice público continua pendente e solicita build', async () => {
  const s = setup();
  s.setPublicPage('<title>Café — Mário Serafim</title><meta property="article:published_time" content="2026-10-22T17:20:00-03:00"/>');
  s.setPublicIndex('<main>Sem artigos</main>');
  await publishDue(s.env, s.options);
  assert.equal(s.hooks(), 1);
  assert.equal(JSON.parse([...s.kv.values()][0]).status, 'pending');
});

test('falha no build público permanece pendente, tenta novamente e confirma após publicar', async () => {
  const s = setup();
  await publishDue(s.env, s.options);
  assert.equal(JSON.parse([...s.kv.values()][0]).status, 'pending');
  await publishDue(s.env, {...s.options, now: now + 31 * 60000});
  assert.equal(s.hooks(), 2);
  assert.equal(JSON.parse([...s.kv.values()][0]).status, 'pending');
  s.setPublicPage('<title>Café — Mário Serafim</title><meta property="article:published_time" content="2026-10-22T17:20:00-03:00"/>');
  s.setPublicIndex('<a href="/blog/post-0">Café</a>');
  await publishDue(s.env, {...s.options, now: now + 32 * 60000});
  assert.equal(JSON.parse([...s.kv.values()][0]).status, 'confirmed');
  assert.equal(s.hooks(), 2);
});

test('deployment ausente limita repetições a 3, com intervalo de 30 minutos', async () => {
  const s = setup();
  for (let i=0; i<5; i++) await publishDue(s.env, {...s.options, now: now + i * 31 * 60000});
  assert.equal(s.hooks(), 3);
  assert.equal(JSON.parse([...s.kv.values()][0]).status, 'pending');
});

test('histórico real do dashboard é preservado e solicitação recente não repete', async () => {
  const s = setup();
  const legacy = JSON.stringify({posts: {'src/content/posts/post-0.md': {due: now, triggeredAt: new Date(now - 60000).toISOString()}}});
  s.kv.set('blog-scheduler-state-v1', legacy);
  assert.equal(await publishDue(s.env, s.options), 0);
  assert.equal(s.hooks(), 0);
  assert.equal(s.kv.get('blog-scheduler-state-v1'), legacy);
});
