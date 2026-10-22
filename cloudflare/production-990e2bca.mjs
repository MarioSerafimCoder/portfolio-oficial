// Snapshot read from Cloudflare API on 2026-10-22. Historical baseline; not the Wrangler entrypoint.
const REPO = 'MarioSerafimCoder/portfolio-oficial';
const STATE_KEY = 'blog-scheduler-state-v1';
const FORTALEZA_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/;

function metadata(markdown, path) {
  const frontmatter = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) throw new Error(`Frontmatter ausente: ${path}`);

  const value = (name) => {
    const match = frontmatter[1].match(new RegExp(`^${name}:\\s*(.*?)\\s*$`, 'm'));
    return match?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
  };

  const status = value('status');
  let when = value('publish_at');

  if (FORTALEZA_TIME.test(when)) {
    when += when.length === 16 ? ':00-03:00' : '-03:00';
  }

  const due = when ? Date.parse(when) : NaN;

  if (status === 'published' && !Number.isFinite(due)) {
    throw new Error(`publish_at inválido: ${path}`);
  }

  return {
    status,
    when,
    due: Number.isFinite(due) ? due : null
  };
}

async function checkPosts(env) {
  if (!env.BLOG_SCHEDULER_KV || !env.CLOUDFLARE_PAGES_DEPLOY_HOOK) {
    throw new Error('Binding KV ou Secret ausente');
  }

  const before = await env.BLOG_SCHEDULER_KV.get(STATE_KEY, 'json') ?? { posts: {} };
  const previous = before.posts ?? {};

  const response = await fetch(
    `https://api.github.com/repos/${REPO}/contents/src/content/posts?ref=main`,
    {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'portfolio-blog-publisher'
      }
    }
  );

  if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);

  const entries = await response.json();
  if (!Array.isArray(entries)) throw new Error('Resposta inesperada do GitHub');

  const files = entries.filter(x =>
    x.type === 'file' &&
    x.path.startsWith('src/content/posts/') &&
    x.name.endsWith('.md')
  );

  const posts = {};
  let changed = files.length !== Object.keys(previous).length;
  let downloaded = 0;

  for (const file of files) {
    const old = previous[file.path];

    if (old?.sha === file.sha) {
      posts[file.path] = old;
      continue;
    }

    if (++downloaded > 40) {
      throw new Error('Mais de 40 arquivos alterados: revisão necessária');
    }

    const raw = await fetch(
      `https://raw.githubusercontent.com/${REPO}/main/${file.path}?v=${file.sha}`
    );

    if (!raw.ok) throw new Error(`Erro ao ler ${file.path}: ${raw.status}`);

    const info = metadata(await raw.text(), file.path);

    posts[file.path] = {
      ...info,
      sha: file.sha,
      triggeredAt: old?.when === info.when ? old.triggeredAt ?? null : null
    };

    changed = true;
  }

  const now = Date.now();

  const due = Object.entries(posts).filter(([, p]) =>
    p.status === 'published' &&
    p.due !== null &&
    p.due <= now &&
    !p.triggeredAt
  );

  if (due.length) {
    const deploy = await fetch(env.CLOUDFLARE_PAGES_DEPLOY_HOOK, {
      method: 'POST'
    });

    if (!deploy.ok) {
      throw new Error(`Deploy Hook HTTP ${deploy.status}`);
    }

    for (const [, post] of due) {
      post.triggeredAt = new Date(now).toISOString();
    }

    changed = true;
    console.log(`Build solicitado para ${due.length} artigo(s)`);
  } else {
    console.log('Nenhum artigo pronto para publicação');
  }

  if (changed) {
    await env.BLOG_SCHEDULER_KV.put(STATE_KEY, JSON.stringify({ posts }));
  }
}

export default {
  async fetch() {
    return new Response('Agendador do blog configurado. Execução via Cron.', {
      status: 200
    });
  },

  async scheduled(_event, env) {
    await checkPosts(env);
  }
};
