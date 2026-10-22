# Agendador do blog

Worker existente: `portfolio-blog-publisher`, Cron a cada 15 minutos, binding `BLOG_SCHEDULER_KV`.

A implementação local foi reconstruída a partir do comportamento informado; equivalência com a versão ativa `990e2bca` e com suas chaves KV ainda precisa ser conferida. Não foi realizado deploy.

Consulte [operação, configuração, implantação e recuperação](../docs/BLOG_INFRASTRUCTURE.md). O secret `CLOUDFLARE_PAGES_DEPLOY_HOOK` é configurado somente na Cloudflare. Nunca grave a URL do hook no Git.
