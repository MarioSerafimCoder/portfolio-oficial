import {postMetadata, publicationTime} from './publication.mjs';
import {githubClient} from './github-client.mjs';

const directory = 'src/content/posts';
// Best effort within one isolate only; KV is not a distributed lock.
let running;
let phase = 'inicializar';

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function attribute(tag, name) {
  const match = new RegExp(`\\b${name}=["']([^"']*)["']`, 'i').exec(tag);
  return match?.[1];
}

export function publicationPageMatches(html, {title, publishAt}) {
  const pageTitle = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  const publishedTime = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => attribute(tag, 'property') === 'article:published_time' ? attribute(tag, 'content') : undefined)
    .find(Boolean);
  const expectedTitle = escapeHtml(title);
  return Boolean(pageTitle && (pageTitle === expectedTitle || pageTitle.startsWith(`${expectedTitle} —`)) && publishedTime === publishAt);
}

export function publicationIsListed(html, slug) {
  return html.includes(`href="/blog/${slug}"`) || html.includes(`href="https://marioserafim.com.br/blog/${slug}"`);
}

export async function publishDue(env, {request = fetch, now = Date.now(), log = console, pause} = {}) {
  phase = 'validar bindings';
  if (!env.BLOG_SCHEDULER_KV || !env.CLOUDFLARE_PAGES_DEPLOY_HOOK) {
    throw new Error('Binding BLOG_SCHEDULER_KV ou secret CLOUDFLARE_PAGES_DEPLOY_HOOK ausente');
  }
  phase = 'inicializar cliente GitHub';
  const github = await githubClient(env, {request, now, log, pause, setPhase: value => {phase = value;}});
  // Preserve dashboard history; migrate lazily without changing the original key.
  phase = 'ler histórico KV';
  const legacyValue = await env.BLOG_SCHEDULER_KV.get('blog-scheduler-state-v1');
  phase = 'interpretar histórico KV';
  const legacyPosts = legacyValue ? JSON.parse(legacyValue).posts || {} : {};
  // Pin all files to one commit to avoid mixing CMS edits during a scan.
  phase = 'consultar commit do GitHub';
  const {sha} = await github('commits/main');
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Commit GitHub inválido');
  phase = 'listar artigos no GitHub';
  const files = await github(`contents/${directory}?ref=${sha}`);
  if (!Array.isArray(files) || files.length >= 1000) throw new Error('Listagem GitHub inválida ou no limite de 1000 arquivos');
  if (files.filter(file => file.type === 'file' && file.name.endsWith('.md')).length > 10) throw new Error('Listagem excede orçamento gratuito de 10 artigos; revisar paginação antes de continuar');
  const due = [];
  let publicIndex;
  for (const file of files.filter(file => file.type === 'file' && file.name.endsWith('.md'))) {
    phase = 'ler metadados de artigo';
    try {
      const blob = await github(`git/blobs/${file.sha}`);
      if (blob.encoding !== 'base64') throw new Error('Encoding GitHub inválido');
      const bytes = Uint8Array.from(atob(blob.content.replace(/\s/g, '')), character => character.charCodeAt(0));
      const metadata = postMetadata(new TextDecoder().decode(bytes));
      if (metadata.status !== 'published') continue;
      const publishAt = publicationTime(metadata.publish_at);
      if (Date.parse(publishAt) > now) continue;
      const key = `publication:v1:${encodeURIComponent(file.path)}:${Date.parse(publishAt)}`;
      const stored = await env.BLOG_SCHEDULER_KV.get(key);
      const legacy = legacyPosts[file.path];
      const state = stored ? JSON.parse(stored) : legacy?.triggeredAt && legacy.due === Date.parse(publishAt)
        ? {status: 'pending', requestedAt: legacy.triggeredAt, attempts: 1} : null;
      const slug = file.name.slice(0, -3);
      // Bypass edge cache and compare the exact scheduled instant. A stale page
      // from an earlier schedule can share the same slug and title.
      phase = 'verificar página pública';
      const page = await request(`https://marioserafim.com.br/blog/${slug}`, {cache: 'no-store', signal: AbortSignal.timeout(10000)});
      const html = page.ok ? await page.text() : '';
      if (page.status !== 404 && !page.ok) throw new Error('Verificação pública indisponível');
      if (page.ok && publicationPageMatches(html, {title: metadata.seo_title || metadata.title, publishAt})) {
        if (publicIndex === undefined) {
          phase = 'verificar índice público';
          const index = await request('https://marioserafim.com.br/blog', {cache: 'no-store', signal: AbortSignal.timeout(10000)});
          if (index.status !== 404 && !index.ok) throw new Error('Verificação pública indisponível');
          publicIndex = index.ok ? await index.text() : '';
        }
        if (publicationIsListed(publicIndex, slug)) {
          if (state?.status !== 'confirmed') {
            phase = 'registrar confirmação no KV';
            await env.BLOG_SCHEDULER_KV.put(key, JSON.stringify({...state, status: 'confirmed', confirmedAt: new Date(now).toISOString(), publishAt}));
            log.log(`Publicação confirmada na listagem e URL pública: ${slug}`);
          }
          continue;
        }
      }
      // An accepted hook is pending. Wait 30 minutes before a bounded retry.
      if (state?.status === 'pending' && state.requestedAt && now - Date.parse(state.requestedAt) < 30 * 60000) continue;
      const attempts = state?.status === 'confirmed' ? 0 : state?.attempts || 0;
      if (attempts >= 3) { log.error(`Deployment não confirmado após 3 solicitações: ${slug}; verificar Pages`); continue; }
      due.push({key, path: file.path, publishAt, attempts: attempts + 1});
    } catch (error) {
      log.error(`Falha ao consultar ou interpretar artigo: ${file.name}`);
      const detail = /^GitHub /.test(error.message) ? error.message : 'YAML, KV ou verificação pública indisponível';
      throw new Error(`Varredura incompleta: ${file.name}: ${detail}`);
    }
  }
  if (!due.length) { log.log('Nenhuma publicação pendente'); return 0; }
  let response;
  try {
    phase = 'chamar Deploy Hook';
    response = await request(env.CLOUDFLARE_PAGES_DEPLOY_HOOK, {
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(10000),
    });
  } catch { throw new Error('Deploy Hook indisponível; publicações continuam pendentes'); }
  if (!response.ok) throw new Error(`Deploy Hook HTTP ${response.status}; publicações continuam pendentes`);
  // Acceptance is pending; only public deployment output can confirm publication.
  phase = 'registrar build pendente no KV';
  for (const post of due) {
    try {
      await env.BLOG_SCHEDULER_KV.put(post.key, JSON.stringify({status: 'pending', attempts: post.attempts, commit: sha, requestedAt: new Date(now).toISOString(), publishAt: post.publishAt}));
    } catch { throw new Error('KV: falha ao registrar build aceito; pode haver repetição no próximo Cron'); }
  }
  log.log(`Build solicitado para ${due.length} artigo(s)`);
  return due.length;
}

export default {
  async scheduled(_event, env) {
    if (running) return running;
    running = publishDue(env).catch(error => {
      // Only messages constructed by this module; never raw network/secret errors.
      const message = /^(GitHub |Deploy Hook |KV:|Binding |Commit |Listagem |Varredura )/.test(error.message)
        ? error.message : `Falha inesperada durante ${phase} (${error.name || 'Error'})`;
      console.error(`Falha no agendador: ${message}; repetir no próximo Cron`);
      throw new Error('Falha no agendador');
    });
    try { await running; } finally { running = undefined; phase = 'inicializar'; }
  },
  fetch() { return new Response('portfolio-blog-publisher: execução somente por Cron'); },
};
