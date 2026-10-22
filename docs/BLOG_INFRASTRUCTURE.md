# Correção preparada após 910e96e — 22/10/2026

Este registro prevalece sobre a descrição histórica abaixo.

## Implantação autorizada após configurar o token

O GITHUB_TOKEN inicialmente cadastrado como plain_text foi validado contra a API GitHub (HTTP 200; limite autenticado 5000/h) e convertido atomicamente em secret_text pela API Cloudflare, preservando os demais bindings. Nenhum valor foi impresso ou versionado. A sessão OAuth local do Wrangler foi reutilizada.

Dry-run Wrangler 4.152.0 aprovado, seguido da implantação. Versão ativa da correção: cf3beea4-d156-4725-a48f-ef61af0fe425. Cron */15 * * * * confirmado; namespace ee5ac0710d04426c9fc927f68f92a2f2 e Secrets CLOUDFLARE_PAGES_DEPLOY_HOOK/GITHUB_TOKEN preservados. Hash do histórico blog-scheduler-state-v1 permaneceu idêntico. workers_dev permanece habilitado e preview_urls foi explicitado como false, mantendo a configuração anterior.

O deployment Pages 307a8e27-3cdf-420c-831c-5c18343b8832 do commit c7b98af concluiu com sucesso, iniciado pelo Git às 17h17min27s, antes da data programada. Às 17h21min49s o artigo ainda retornava 404, aguardando o Cron das 17h30. O tail de produção foi conectado antes dessa execução.

## Preparação anterior à implantação

- Fonte ativa recuperada pela API Cloudflare via OAuth local já existente; snapshot sem credenciais em cloudflare/production-990e2bca.mjs. Confirmados namespace, secret, Cron, compatibilidade e observabilidade. Wrangler 4.152.0 instalado isoladamente em tmp/wrangler-safe (não versionado) após resolver os problemas do instalador transitório.
- Causa histórica do 403 **não comprovada**: o Worker ativo faz a consulta Contents sem autenticação e lança somente o status, descartando corpo e headers. Logs das 16h45 não permitem distinguir rate limit de política/permissão. Às 17h00 houve recuperação espontânea: Nenhum artigo pronto para publicação. A API pública local respondeu 200, com limite 60 e 53 requisições restantes; isso não mede o IP de saída do Worker. Hipótese principal: limite compartilhado de acesso anônimo, ainda sem prova. Referência: https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api
- Correção local exige GITHUB_TOKEN, elimina dependência do limite anônimo, classifica 403/429 por headers/corpo sem imprimir conteúdo sensível e persiste cooldown no KV respeitando reset/retry-after. HTTP 401 e 403 não geram repetição imediata; rede/5xx têm no máximo 2 tentativas, espera de 1 segundo. Orçamento de 16 chamadas GitHub e 10 artigos por execução para conter subrequests no plano gratuito; crescimento exige paginação e novo dimensionamento.
- Hook aceito grava status pending. Uma publicação só vira confirmed depois de data vencida e URL pública 200 contendo seu título SEO. Esta é confirmação da saída pública do deploy, não consulta ao status interno de uma tarefa Pages. Página 404 mantém pendência; outros erros abortam sem novo hook. No máximo 3 solicitações com intervalo de 30 minutos; depois exige verificar Pages manualmente. Confirmação não aciona outro build.
- Histórico real: chave blog-scheduler-state-v1, objeto posts com path/status/when/due/sha/triggeredAt. A nova implementação lê esse histórico, reaproveita acionamentos da mesma data como pendentes e nunca altera ou apaga a chave original. Novos registros ficam nas chaves publication:v1. Ausência de token aborta antes de tocar no histórico.
- Implantação bloqueada por GITHUB_TOKEN ausente. Configurar manualmente token fine-grained, somente MarioSerafimCoder/portfolio-oficial, Contents: Read-only (Metadata de leitura implícita), com expiração, como Secret no Worker. Não enviar token no chat. A sessão Wrangler OAuth já funciona; não é necessário criar outra credencial Cloudflare.
- Para conferir/implantar usar node tmp/wrangler-safe/node_modules/wrangler/bin/wrangler.js deploy --dry-run --config cloudflare/wrangler.jsonc, seguido de deploy com a mesma configuração somente após configurar/validar o Secret. Secrets não são exportados nem sobrescritos. Não executar o snapshot histórico.
- Às 17h10 de Fortaleza, a URL do artigo de 17h20 ainda retornava 404, corretamente antes da data. Não é evidência de falha. Execução de 17h30 e publicação automática continuam pendentes de observação; um push posterior ao horário pode publicar pelo Git e não comprova o Cron.

- Validação desta correção: 25 testes aprovados, TypeScript e build estático aprovados; Wrangler 4.152.0 dry-run aprovado (121,07 KiB; gzip 24,32 KiB), mostrando o namespace existente. Não houve deploy do Worker nem gravação em KV de produção.
- Pages consultado pela API: deployment b85c3c81-a789-4448-a162-a73b447eb56e do commit 910e96e com status success, origem github:push, criado às 17h07min55s. Às 17h16min59s a URL do artigo ainda retornava 404, antes das 17h20. A publicação futura ainda não pode ser validada.

---

# Publicação do blog — 22/10/2026

## Arquitetura e origem do código

Pages CMS → commits em `MarioSerafimCoder/portfolio-oficial`, branch `main` → Cloudflare Pages `portfolio-oficial` → `https://marioserafim.com.br`.
O CMS lê `.pages.yml` e edita Markdown em `src/content/posts` e mídia em `public/media/blog`. O build executa `pnpm run build` (Node 24, pnpm 10), filtra os artigos e exporta Next.js para `out`. Configure `NEXT_PUBLIC_SITE_URL=https://marioserafim.com.br`. Rascunhos e datas futuras não entram nas rotas, listagem, RSS ou sitemap; a demonstração editorial é uma exceção explícita do template e permanece preservada.

O Worker independente `portfolio-blog-publisher` consulta o GitHub a cada 15 minutos e chama o Deploy Hook `blog-scheduler` do Pages, ligado a `main`, somente ao encontrar publicações vencidas sem registro no KV. O endpoint público do Worker é `portfolio-blog-publisher.marioserafim-da.workers.dev`; não é a URL do Deploy Hook.

O repositório foi atualizado de `8f47a3e` para `8f04db1`, incluindo os dois commits posteriores do Pages CMS. A versão ativa do Worker `990e2bca` foi confirmada no dashboard, assim como o binding, o secret e o Cron. O editor de código permaneceu em carregamento, sem disponibilizar a fonte. Portanto, `cloudflare/scheduled-rebuild.mjs` é uma reconstrução do comportamento documentado, com melhorias de confiabilidade, **não uma cópia verificada do código de produção**. Nenhum Worker, recurso, binding, secret, DNS ou Cron foi implantado ou modificado nesta manutenção.

## Configuração reproduzível

`cloudflare/wrangler.jsonc` declara o nome existente, data de compatibilidade `2026-10-22`, observabilidade, `keep_vars`, Cron `*/15 * * * *` e binding `BLOG_SCHEDULER_KV`. O ID do namespace existente `portfolio-blog-scheduler` foi conferido no dashboard; ele não é uma credencial. Não crie outro namespace.

Secrets configurados fora do Git:

- `CLOUDFLARE_PAGES_DEPLOY_HOOK`: URL privada do hook já existente; obrigatória. Não copiar para documentação, logs ou arquivos versionados.
- `GITHUB_TOKEN`: opcional na implementação local, para consultas autenticadas em caso de limitação da API pública. Não foi criado nem configurado. Caso necessário, usar token de leitura restrito ao repositório e configurar como secret. A implementação de produção ainda precisa ser comparada para verificar se aceita esse secret.

`.dev.vars*`, `.env*` e `.wrangler/` são ignorados. Não inserir credenciais em parâmetros de comandos nem no frontend.

## Publicar e agendar

1. No Pages CMS, preencher título, resumo, categoria, conteúdo e capa com texto alternativo.
2. Usar `status: draft` durante revisão. Para publicar ou agendar, selecionar `published` e preencher `publish_at`, por exemplo `2026-10-22T17:20`.
3. Datas sem offset são interpretadas como `America/Fortaleza` (UTC−03:00), inclusive com segundos. Datas com `Z` ou offset explícito mantêm seu instante. Datas inválidas interrompem o build/varredura. Build e Worker local compartilham o mesmo parser, preservando datas YAML sem aspas como strings.
4. Salvar gera commit e build automático; antes da data, o artigo permanece excluído. Ao vencer a data, o próximo Cron solicita outro build. Atraso nominal: até 15 minutos mais a duração do build; falhas podem ampliar esse prazo.
5. Conferir deployment concluído, URL do artigo, `/blog`, `/feed.xml`, `/blog/feed.xml` e `/sitemap.xml`.

## Estado, falhas e concorrência

O Worker local fixa um commit de `main`, lista os Markdown e lê seus blobs UTF-8. Para cada artigo `published` vencido, consulta uma chave `publication:v1:<caminho codificado>:<instante em milissegundos>`. Um lote elegível gera uma chamada ao hook. Somente após resposta HTTP de sucesso grava os marcadores, sem expiração. Edições de conteúdo usam o build da integração Git; mudança de data cria outro marcador.

Falha HTTP/timeout do hook não consome publicações: o próximo Cron tenta novamente. Erros de GitHub, YAML ou KV abortam a execução, sem declarar sucesso. O código não imprime a URL privada ou corpos de respostas. Consulta de arquivos é sequencial e possui timeout por requisição; o uso foi dimensionado para um blog pequeno. A listagem GitHub rejeita o limite de 1000 arquivos; crescimento exige rever limites de subrequests, duração, leituras KV e rate limit GitHub.

KV tem [consistência eventual](https://developers.cloudflare.com/kv/concepts/how-kv-works/) e não fornece trava atômica. O código reúne chamadas simultâneas apenas dentro do mesmo isolate. Cron único e intervalo de 15 minutos reduzem sobreposição, mas **não garantem execução exatamente uma vez** entre isolates. Se o hook aceitar o build e a gravação KV falhar (ou houver timeout após aceitação), pode haver build repetido; prioriza-se não perder publicação. Não foi criado Durable Object ou outro recurso para resolver esse limite.

O marcador significa **build solicitado**, não build concluído. Se o Pages falhar depois de aceitar o hook, é necessário repetir o deployment no Pages. Uma implantação futura com este esquema de chaves exige conferir/migrar os marcadores existentes: esquema de produção ainda desconhecido; sem migração, artigos antigos podem provocar um primeiro rebuild adicional.

## Domínio e DNS

Configurações informadas como aplicadas via dashboard; não são gerenciadas pelo Wrangler:

- Domínio ativo `marioserafim.com.br`, associado ao Pages.
- Nameservers `adam.ns.cloudflare.com` e `addyson.ns.cloudflare.com`.
- CNAME `@` → `portfolio-oficial-8fl.pages.dev`.
- A `www` → `192.0.2.1`, com proxy.
- Redirect Rule ativa `WWW para domínio principal`: `http*://www.marioserafim.com.br/*` → `https://marioserafim.com.br/${2}`, status 301, preservando query strings.

Em 22/10 às 16h59 de Fortaleza, consultas HTTP independentes confirmaram:

| Origem | Resultado |
| --- | --- |
| `https://marioserafim.com.br/blog` | 200 |
| `http://marioserafim.com.br/blog?check=redirect` | 301 para HTTPS principal, mesmo caminho/query |
| `http://www.marioserafim.com.br/blog?check=redirect` | 301 para HTTPS principal, mesmo caminho/query |
| `https://www.marioserafim.com.br/blog?check=redirect` | 301 para HTTPS principal, mesmo caminho/query |

Uma segunda consulta seguindo os redirects confirmou resposta final 200 na raiz para HTTP/HTTPS com e sem `www`, e em `/blog?check=redirect` nas duas variantes de `www`, sempre no domínio HTTPS principal.

## Logs e recuperação

No dashboard: Workers & Pages → `portfolio-blog-publisher` → Observability. Ajustar intervalo de datas e consultar eventos do Cron. Logs persistidos estavam habilitados com amostragem 100%. O painel exibe BRT/UTC−03:00; confirmar o fuso antes de correlacionar horários. Também é possível usar `wrangler tail --config cloudflare/wrangler.jsonc` com acesso autorizado, para eventos futuros.

Procurar `Build solicitado para N artigo(s)`, `Nenhuma publicação pendente` e erros. Correlacionar com Workers & Pages → `portfolio-oficial` → Deployments, verificando horário, commit, origem do acionamento, logs e conclusão. Não executar o evento Schedule do editor como simples teste: isso pode chamar o hook e gravar KV.

- `GitHub HTTP 403/429`: verificar rate limit e permissões; considerar o secret opcional de leitura após comparar a implementação ativa. Não assumir que qualquer 403 seja exclusivamente rate limit. Não executar um hook se a varredura falhou.
- Falha no hook: conferir existência de `blog-scheduler`, branch `main` e secret; depois aguardar o Cron. Nunca publicar a URL.
- Falha no build: corrigir o Markdown/build e repetir o deployment no Pages; não apagar todo o KV.
- Falha KV: conferir binding e namespace existentes. Depois de hook aceito, avaliar duplicação antes de repetir manualmente.
- Artigo ausente: conferir status, fuso, `publish_at`, commit de `main`, logs do Cron e resultado do deployment. Não antecipar a data como tentativa de correção.

## Alterações futuras sem apagar configuração

1. Exportar/conferir o código da versão ativa e registrar sua versão. Comparar também o esquema de chaves KV, Cron, bindings, compatibilidade, logs e nomes dos secrets, sem exportar valores secretos. Resolver a diferença antes de substituir o Worker.
2. Usar o namespace existente do `wrangler.jsonc`. Manter `triggers.crons`, `kv_namespaces` e observabilidade versionados; `keep_vars` preserva variáveis de dashboard, mas não substitui a declaração dos bindings e Cron. Ver [configuração Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/) e [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/).
3. Executar `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm run build`, `pnpm run check` e `pnpm dlx wrangler@4 deploy --dry-run --config cloudflare/wrangler.jsonc`. Revisar o bundle e bindings exibidos. O dry-run não implanta recursos.
4. Somente após a comparação, migração de estado necessária e revisão dos riscos, implantar com a configuração completa: `pnpm dlx wrangler@4 deploy --config cloudflare/wrangler.jsonc`. Não usar comandos para criar namespace ou sobrescrever secrets. Não implantar arquivo isolado com configuração incompleta.
5. Conferir versão ativa, secret ainda presente, binding apontando ao mesmo namespace e Cron de 15 minutos após o deploy. A propagação do Cron pode levar até 15 minutos. Se necessário, reverter para versão anterior conferindo também a configuração; reversão de código não recupera automaticamente estado KV.

## Evidências e pendências

**Confirmado nesta manutenção:** sincronização com `8f04db1`; artigo de teste no Markdown com `publish_at: 2026-10-22T17:20`; versão ativa `990e2bca`; secret criptografado com nome esperado; binding para o namespace existente; Cron de 15 minutos; log `Build solicitado para 1 artigo(s)` às 16h30min57s; redirecionamentos acima; artigo agendado ausente da listagem e URL retornando 404 às 16h59 (antes de 17h20).

**Falha observada:** às 16h45min39s, logs exibiram `GitHub HTTP 403`. A causa e sua recuperação em produção permanecem pendentes. Não houve alteração no Worker ativo para corrigir isso.

**Informado pelo responsável:** o rebuild solicitado às 16h30 foi concluído com sucesso no Pages. Isso confirma Cron/hook/rebuild, não o ciclo completo de uma publicação futura.

**Ainda pendente:** verificar execução de 17h30, build concluído, aparição automática do artigo e ausência de builds desnecessários nas execuções seguintes; o horário ainda era futuro na primeira consulta. Comparar fonte e chaves KV do Worker ativo com a reconstrução local antes de qualquer deploy. Limpeza de demonstrações somente após validação e aprovação explícita.

## Validação local

- 20 testes aprovados: datas/offset/calendário, fronteira do agendamento, rascunhos, agrupamento, deduplicação, recuperação de HTTP/timeout, falhas GitHub/KV, concorrência no mesmo isolate e testes existentes do site.
- `pnpm run check` aprovado; exportação completa aprovada com Node 24.19.0 e pnpm 10.34.7 (também testada no pnpm 11 disponível no ambiente).
- Consulta real ao GitHub pelo Worker local, com hook e KV simulados: um artigo vencido identificado às 16h59, futuro excluído; nenhum acionamento real de build ou escrita no KV de produção.
- Bundle ESM para browser gerado pelo esbuild (aproximadamente 110 KB), sem dependência de APIs Node.
- `wrangler deploy --dry-run` não concluído por falhas da instalação local transitória (módulo `undici` ausente no pnpm 11; instalação alternativa pnpm 10 também falhou). Essa verificação permanece necessária antes de qualquer deploy. O sucesso do bundle não substitui essa validação de configuração/runtime.
- O JSON gerado pelo build não é incluído nesta manutenção: ele é reconstruído a cada build a partir dos Markdown sincronizados.
