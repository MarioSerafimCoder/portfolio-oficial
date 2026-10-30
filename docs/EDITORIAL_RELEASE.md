# Publicação dos blocos editoriais — 30/10/2026

Release preparada a partir de `main` em `34af157ed5123195b4ab73dce9770934733c4898`, aplicando o patch consolidado; a branch temporária de QA não foi integrada. Nenhum artigo, tradução de artigo, configuração Cloudflare ou dependência foi alterado.

## Correção de ambiente

A worktree usava um junction de `node_modules` para o diretório original. O Turbopack não permite compilar dependências fora da raiz detectada. Foi removido somente esse junction e executado `pnpm install --frozen-lockfile` dentro da worktree. Next 16.4.2, lockfile, scripts e configurações permaneceram iguais. A instalação local resolveu o erro sem ajuste do Turbopack.

## Verificação anterior ao push

- 88 testes Node aprovados; TypeScript aprovado.
- `pnpm run build` terminou com código zero, incluindo imagens, conteúdo, Next e validação de 38 documentos HTML.
- 12 combinações de idioma, viewport e tema aprovadas no harness de navegador disponível; sem overflow, erros de hidratação ou violações axe A/AA no conteúdo testado.
- Não há script de lint no projeto.
- Fixtures e relatórios ficam fora de `public` e de rotas publicáveis. A exportação não contém artigos ou rotas novos de QA.
- O harness de navegador utiliza as ferramentas já disponíveis no ambiente de homologação; Puppeteer não foi acrescentado às dependências da aplicação.

O push e o PR podem gerar previews automáticos. Esses previews são esperados nesta publicação autorizada. Merge somente após validar o diff e os checks do commit enviado.

## Rollback preparado antes do merge

Baseline de código: `34af157ed5123195b4ab73dce9770934733c4898`. Se necessário, criar uma branch a partir da `main` atual e executar `git revert` do commit de squash desta release, validar testes/build e integrar o revert por PR. Não usar reset destrutivo nem force-push. O revert deve preservar alterações posteriores e todo histórico de artigos.

Uma alternativa é selecionar o último deployment de produção bem-sucedido no Cloudflare Pages, após confirmar seu commit e ambiente; um preview não é alvo válido de rollback de produção. Nenhum rollback será executado automaticamente em caso de falha: primeiro registrar e investigar o erro. Nenhuma mudança de infraestrutura faz parte desta release.

## Validação posterior ao deploy

Conferir o commit e o check Cloudflare, domínio de produção, artigos existentes e ausência das rotas QA. Como os artigos reais não contêm os novos marcadores, exercitar os três blocos com uma fixture aplicada somente à resposta no navegador de teste, utilizando os bundles e CSS publicados. Esse procedimento não grava conteúdo no CMS, Git ou servidor; seus resultados devem ser identificados como teste controlado do renderer publicado. Conferir também o formulário autenticado do Pages CMS em `main`, sem salvar conteúdo temporário.
