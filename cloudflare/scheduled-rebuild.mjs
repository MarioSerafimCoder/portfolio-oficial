export default {
  async scheduled(_event, env) {
    if (!env.CLOUDFLARE_PAGES_DEPLOY_HOOK) throw new Error('CLOUDFLARE_PAGES_DEPLOY_HOOK não configurado');
    const response = await fetch(env.CLOUDFLARE_PAGES_DEPLOY_HOOK, {method:'POST'});
    if (!response.ok) throw new Error(`Rebuild falhou: ${response.status}`);
  },
};
