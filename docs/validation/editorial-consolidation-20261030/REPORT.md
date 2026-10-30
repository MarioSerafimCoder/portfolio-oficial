# Consolidação dos blocos editoriais — 30/10/2026

Implementação pronta no workspace e na branch **local** `codex/editorial-blocks-consolidation`, baseada em `origin/main` (`34af157ed5123195b4ab73dce9770934733c4898`). Sem commits locais, push, PR, merge ou novo deploy nesta etapa. O patch inclui arquivos ainda não rastreados; o índice Git do usuário não foi usado para prepará-lo.

## Comparação e escopo definitivo

A branch remota `codex/cms-editorial-qa-20261030` difere de `main` em somente dois arquivos: `.pages.yml` e o rascunho `src/content/posts/qa-blocos-editoriais-20261030.md`. O `.pages.yml` local é idêntico ao homologado. Os componentes, CSS e traduções ainda não estão nessa branch remota; por isso ela **não deve ser integrada diretamente**.

O diff definitivo reúne:

- `.pages.yml`: aspas no rótulo com dois-pontos e `body.options` com Markdown/alternância Editor/Source.
- `src/lib/editorial-block.ts` e `src/components/markdown-content.tsx`: reconhecimento dos três marcadores, crédito opcional, semântica e fallback existentes; HTML literal e validação de URLs preservados.
- `src/app/blog/article-reading.css`: regras limitadas às classes dos blocos; temas usam os tokens existentes.
- Catálogos `src/i18n/editorial/site.json`, `source/site.json` e `en/site.json`: rótulo da nota do autor. Manifest/status sem diferenças semânticas foram excluídos do patch.
- Foco de teclado em `pre`, regressões, fixture real do CMS e renderização isolada automatizada. A renderização agora verifica PT/EN, SSR e foco, e grava evidências novas separadamente das históricas.
- Documentação atualizada: removidas instruções/pendências históricas contraditórias; preservados os relatórios e screenshots da homologação.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| Testes Node existentes | **88/88 aprovados** |
| TypeScript `--noEmit` | Aprovado |
| Build Next estático em cópia temporária | Aprovado |
| Validação do export | 38 documentos HTML válidos |
| Artigos gerados antes/depois do pipeline | JSON integral idêntico |
| Renderização PT/EN × 1440/390/320 px × claro/escuro | **12/12 aprovadas** |
| SSR, rótulos PT/EN, links, negrito, crédito, foco e HTML literal | Aprovados |
| Overflow/erros de página/axe WCAG A/AA no conteúdo | Zero |
| Conteúdo, infraestrutura e dependências | 19 arquivos comparados com `origin/main`, idênticos usando filtros Git de normalização |

Evidências: [verificação e arquivos preservados](verification.json), [build](build-result.json), [log do build](build.log), [renderização](rendering.json), [PT desktop claro](pt-1440-light.png), [EN mobile escuro](en-390-dark.png). A suíte de publicação usa mocks; a mensagem de teste “Build solicitado” não executa um hook real. Os avisos de `metadataBase` no build pertencem às rotas existentes, fora do escopo desta mudança.

Nenhum arquivo de `src/content/posts`, revisão editorial, tradução de artigo, conteúdo gerado, dependência, workflow ou arquivo Cloudflare integra o diff. Os testes não detectaram regressões nas funcionalidades existentes. Isso é evidência de preservação, não uma garantia absoluta de ausência de todo defeito possível.

## Limpeza

As cópias temporárias de aplicação/servidor foram encerradas e removidas automaticamente; não há rota temporária nos fontes ou no export. Fixtures e screenshots foram preservados porque sustentam os testes e a homologação. Nenhuma exclusão remota foi feita: alterar o rascunho da branch QA poderia acionar outro preview. O rascunho continua isolado e está ausente do patch definitivo; sua limpeza remota fica pendente de uma janela com deploy controlado.

## Cloudflare e decisão sobre PR

A evidência real da etapa anterior registra previews Cloudflare após commits na branch QA. A integração Git pode criar deployments tanto por push quanto por abertura de PR, conforme a [documentação oficial](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/). `cloudflare/wrangler.jsonc` descreve o Worker agendador, não os controles de preview do projeto Pages; seu `preview_urls: false` **não desativa previews do Pages**.

Nesta etapa, uma única tentativa GET da configuração Pages, usando a sessão OAuth local já existente, retornou **401**. Não foram expostas credenciais, solicitada nova autenticação, alteradas permissões ou feitas gravações. Assim, os valores atuais de inclusão/exclusão de branches não foram confirmados. A evidência anterior comprova o comportamento naquela branch, mas não prova uma exclusão segura para esta nova branch. Por isso, não houve push nem criação de PR.

Sem alterar infraestrutura, a opção documentada para omitir um deploy Git é iniciar a mensagem de commit com **`[CF-Pages-Skip]`** (prefixo, não somente um texto no corpo do PR). Fonte: [Skipping a build via a commit message](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#skipping-a-build-via-a-commit-message). Isso foi documentado, não experimentado em produção. Não altera nem desliga o Worker/Cron ou hooks, que são gatilhos independentes.

## Procedimento seguro de integração

1. Revisar o patch local completo `tmp/editorial-blocks-integration.patch` e a [descrição de PR preparada](PR.md). A base exata e a lista de arquivos estão em `patch-manifest.json`. O patch foi validado contra a base com `git apply --cached --check` em índice temporário.
2. Aplicar o patch numa branch limpa baseada em `main`; não fazer merge/cherry-pick indiscriminado da branch QA. Os arquivos de evidência são intencionais; o artigo QA não está incluído.
3. Se for necessário publicar a branch sem deployment, usar o prefixo documentado `[CF-Pages-Skip]` em **cada** commit enviado, após conferir as condições atuais da integração Pages e o comportamento de PR. Não tratar PR em draft como bloqueio de deploy. Esta etapa não comprovou o skip na conta e, por isso, não o usou para tentar uma gravação remota.
4. Revisar e aprovar o PR. Integrar em `main` somente quando o deployment automático de produção estiver explicitamente autorizado. Se a intenção for apenas integrar código sem deploy Git, a mensagem final do squash/merge também precisa preservar o prefixo documentado; isso não bloqueia acionamentos independentes por Cron/hook.
5. Limpar posteriormente a branch/rascunho remoto de QA somente com os gatilhos de deploy compreendidos e a operação autorizada. Nenhuma alteração de configuração Cloudflare é proposta ou executada aqui.

Pendências: revisão e publicação do PR em condição segura; merge e deploy de produção quando autorizados; limpeza remota do rascunho QA. A consolidação local e as verificações técnicas estão concluídas.
