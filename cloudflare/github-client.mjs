const cooldownKey = 'scheduler:github:retry-after';

const defaultPause = ms => globalThis.scheduler?.wait
  ? globalThis.scheduler.wait(ms)
  : new Promise(resolve => setTimeout(resolve, ms));

async function pauseBeforeRetry(pause, setPhase) {
  setPhase('aguardar retentativa GitHub');
  try { await pause(1000); }
  catch { /* Keep the retry bounded; if timers are unavailable, retry immediately. */ }
}

export async function githubClient(env, {request, now, log, pause = defaultPause, setPhase = () => {}}) {
  if (!env.GITHUB_TOKEN) throw new Error('GitHub: configurar Secret GITHUB_TOKEN (Contents: read-only)');
  setPhase('ler cooldown GitHub no KV');
  let blockedUntil;
  try { blockedUntil = Number(await env.BLOG_SCHEDULER_KV.get(cooldownKey)); }
  catch { throw new Error('KV: falha ao ler cooldown do GitHub'); }
  if (blockedUntil > now) throw new Error(`GitHub: cooldown até ${new Date(blockedUntil).toISOString()}`);
  let requests = 0;
  return async path => {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (++requests > 16) throw new Error('GitHub: orçamento de 16 requisições por execução esgotado');
      let response;
      try {
        setPhase('enviar requisição HTTP ao GitHub');
        response = await request(`https://api.github.com/repos/MarioSerafimCoder/portfolio-oficial/${path}`, {
          headers: {'User-Agent': 'portfolio-blog-publisher', Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${env.GITHUB_TOKEN}`},
          signal: AbortSignal.timeout(10000), redirect: 'manual',
        });
      } catch (error) {
        const causeCode = /^[A-Z0-9_]+$/.test(error?.cause?.code || '') ? error.cause.code : undefined;
        log.error(JSON.stringify({service: 'github', kind: 'request-failure', attempt: attempt + 1,
          errorName: typeof error?.name === 'string' ? error.name : 'Error', causeCode}));
        if (attempt === 0) { await pauseBeforeRetry(pause, setPhase); continue; }
        throw new Error('GitHub: rede indisponível após 2 tentativas');
      }
      if (response.ok) {
        try {
          setPhase('ler JSON da API do GitHub');
          return await response.json();
        } catch {
          if (attempt === 0) { await pauseBeforeRetry(pause, setPhase); continue; }
          throw new Error('GitHub: resposta JSON inválida após 2 tentativas');
        }
      }
      if (response.status === 403 || response.status === 429) {
        const body = await response.json().catch(() => ({}));
        const remaining = response.headers.get('x-ratelimit-remaining');
        const retry = Number(response.headers.get('retry-after'));
        const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000;
        const kind = remaining === '0' ? 'primary-rate-limit' : /secondary rate|abuse/i.test(body.message || '') ? 'secondary-rate-limit' : response.status === 429 || retry > 0 ? 'rate-limit' : 'permission-or-policy';
        const until = Math.max(now + (retry > 0 ? retry * 1000 : 15 * 60000), remaining === '0' && Number.isFinite(reset) ? reset + 1000 : 0);
        // Allowlist diagnostic fields only; never log body, Authorization or URLs.
        log.error(JSON.stringify({service: 'github', status: response.status, kind, remaining,
          limit: response.headers.get('x-ratelimit-limit'), reset: response.headers.get('x-ratelimit-reset'),
          requestId: response.headers.get('x-github-request-id'), retryAt: new Date(until).toISOString()}));
        setPhase('gravar cooldown GitHub no KV');
        try { await env.BLOG_SCHEDULER_KV.put(cooldownKey, String(until)); }
        catch { throw new Error('KV: falha ao gravar cooldown do GitHub'); }
        throw new Error(`GitHub HTTP ${response.status}: ${kind}; aguardar cooldown`);
      }
      if (response.status >= 500 && attempt === 0) { await pauseBeforeRetry(pause, setPhase); continue; }
      throw new Error(`GitHub HTTP ${response.status}${response.status === 401 ? ': token inválido ou expirado' : ''}`);
    }
  };
}
