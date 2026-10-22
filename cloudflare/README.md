# Publicação agendada de Pausa do café

O Pages CMS escreve Markdown em `src/content/posts` no branch `main`. O build (`node scripts/build-posts.mjs && next build`) interpreta `publish_at` sem offset como horário de `America/Fortaleza` (UTC-03:00) e só exporta artigos publicados cujo horário já passou. Rascunhos e posts futuros não geram URL, listagem, RSS ou sitemap.

A hospedagem atual do portfólio é Sites, conforme `.openai/hosting.json`. O rebuild agendado da Cloudflare requer que o repositório seja conectado a um projeto Cloudflare Pages de produção. Configure o comando de build `pnpm run build` e a saída `out`; crie um Deploy Hook para `main`; adicione sua URL como secret `CLOUDFLARE_PAGES_DEPLOY_HOOK` no Worker deste diretório; publique o Worker com Wrangler. O cron UTC a cada 15 minutos dispara um novo build, com atraso máximo de aproximadamente 15 minutos mais o tempo de build. Nunca grave o URL do hook no Git. A conexão Cloudflare/Worker não é criada por este código e não altera a hospedagem Sites existente.

