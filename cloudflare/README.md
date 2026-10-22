# Agendador do blog

Worker existente: `portfolio-blog-publisher`, Cron a cada 15 minutos, binding `BLOG_SCHEDULER_KV`.

A fonte ativa foi recuperada pela API e preservada em `production-990e2bca.mjs` como histórico. A implementação corrigida em `scheduled-rebuild.mjs` lê o histórico KV existente, exige `GITHUB_TOKEN` de leitura e confirma a URL pública antes de concluir a publicação. Não foi realizado deploy: falta configurar esse Secret. O snapshot histórico não deve ser implantado.

Consulte [operação, configuração, implantação e recuperação](../docs/BLOG_INFRASTRUCTURE.md). O secret `CLOUDFLARE_PAGES_DEPLOY_HOOK` é configurado somente na Cloudflare. Nunca grave a URL do hook no Git.
