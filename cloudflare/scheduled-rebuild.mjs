import {postMetadata, publicationTime} from './publication.mjs';

const repository = 'MarioSerafimCoder/portfolio-oficial';
const directory = 'src/content/posts';
// Best effort within one isolate only; KV is not a distributed lock.
let running;

export async function publishDue(env, {request = fetch, now = Date.now(), log = console} = {}) {
  if (!env.BLOG_SCHEDULER_KV || !env.CLOUDFLARE_PAGES_DEPLOY_HOOK) {
    throw new Error('Binding BLOG_SCHEDULER_KV ou secret CLOUDFLARE_PAGES_DEPLOY_HOOK ausente');
  }
  const github = async path => {
    let response;
    try {
      response = await request(`https://api.github.com/repos/${repository}/${path}`, {
        headers: {'User-Agent': 'portfolio-blog-publisher', Accept: 'application/vnd.github+json',
          ...(env.GITHUB_TOKEN ? {Authorization: `Bearer ${env.GITHUB_TOKEN}`} : {})},
        signal: AbortSignal.timeout(10000),
      });
    } catch { throw new Error('GitHub indisponível'); }
    if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
    return response.json();
  };
  // Pin all files to one commit to avoid mixing CMS edits during a scan.
  const {sha} = await github('commits/main');
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Commit GitHub inválido');
  const files = await github(`contents/${directory}?ref=${sha}`);
  if (!Array.isArray(files) || files.length >= 1000) throw new Error('Listagem GitHub inválida ou no limite de 1000 arquivos');
  const due = [];
  for (const file of files.filter(file => file.type === 'file' && file.name.endsWith('.md'))) {
    try {
      const blob = await github(`git/blobs/${file.sha}`);
      if (blob.encoding !== 'base64') throw new Error('Encoding GitHub inválido');
      const bytes = Uint8Array.from(atob(blob.content.replace(/\s/g, '')), character => character.charCodeAt(0));
      const metadata = postMetadata(new TextDecoder().decode(bytes));
      if (metadata.status !== 'published') continue;
      const publishAt = publicationTime(metadata.publish_at);
      if (Date.parse(publishAt) > now) continue;
      const key = `publication:v1:${encodeURIComponent(file.path)}:${Date.parse(publishAt)}`;
      if (!(await env.BLOG_SCHEDULER_KV.get(key))) due.push({key, path: file.path, publishAt});
    } catch (error) {
      log.error(`Falha ao consultar ou interpretar artigo: ${file.name}`);
      const detail = /^GitHub (HTTP \d+|indisponível)$/.test(error.message) ? error.message : 'YAML inválido ou falha na leitura KV';
      throw new Error(`Varredura incompleta: ${file.name}: ${detail}`);
    }
  }
  if (!due.length) { log.log('Nenhuma publicação pendente'); return 0; }
  let response;
  try {
    response = await request(env.CLOUDFLARE_PAGES_DEPLOY_HOOK, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
    });
  } catch { throw new Error('Deploy Hook indisponível; publicações continuam pendentes'); }
  if (!response.ok) throw new Error(`Deploy Hook HTTP ${response.status}; publicações continuam pendentes`);
  // Never mark before acceptance: failures are retried at the next Cron.
  for (const post of due) {
    try {
      await env.BLOG_SCHEDULER_KV.put(post.key, JSON.stringify({commit: sha, requestedAt: new Date(now).toISOString(), publishAt: post.publishAt}));
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
      const message = /^(GitHub |Deploy Hook |KV:|Binding |Commit |Listagem |Varredura )/.test(error.message) ? error.message : 'Falha ao ler KV ou interpretar artigos';
      console.error(`Falha no agendador: ${message}; repetir no próximo Cron`);
      throw new Error('Falha no agendador');
    });
    try { await running; } finally { running = undefined; }
  },
  fetch() { return new Response('portfolio-blog-publisher: execução somente por Cron'); },
};
