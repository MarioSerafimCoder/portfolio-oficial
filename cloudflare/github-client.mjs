const cooldownKey = 'scheduler:github:retry-after';

export async function githubClient(env, {request, now, log, pause = ms => new Promise(resolve => setTimeout(resolve, ms))}) {
  if (!env.GITHUB_TOKEN) throw new Error('GitHub: configurar Secret GITHUB_TOKEN (Contents: read-only)');
  const blockedUntil = Number(await env.BLOG_SCHEDULER_KV.get(cooldownKey));
  if (blockedUntil > now) throw new Error(`GitHub: cooldown até ${new Date(blockedUntil).toISOString()}`);
  let requests = 0;
  return async path => {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (++requests > 16) throw new Error('GitHub: orçamento de 16 requisições por execução esgotado');
      let response;
      try {
        response = await request(`https://api.github.com/repos/MarioSerafimCoder/portfolio-oficial/${path}`, {
          headers: {'User-Agent': 'portfolio-blog-publisher', Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${env.GITHUB_TOKEN}`},
          signal: AbortSignal.timeout(10000), redirect: 'error',
        });
      } catch {
        if (attempt === 0) { await pause(1000); continue; }
        throw new Error('GitHub: rede indisponível após 2 tentativas');
      }
      if (response.ok) return response.json();
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
        await env.BLOG_SCHEDULER_KV.put(cooldownKey, String(until));
        throw new Error(`GitHub HTTP ${response.status}: ${kind}; aguardar cooldown`);
      }
      if (response.status >= 500 && attempt === 0) { await pause(1000); continue; }
      throw new Error(`GitHub HTTP ${response.status}${response.status === 401 ? ': token inválido ou expirado' : ''}`);
    }
  };
}
