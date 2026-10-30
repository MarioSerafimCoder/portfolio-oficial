# Homologação dos blocos editoriais — 30/10/2026

## Resultado

**CMS hospedado: APROVADO na branch isolada, após corrigir a configuração.** Os três blocos foram inseridos, editados, salvos, fechados e reabertos no Pages CMS real. Não se trata de inferência a partir de testes unitários. A restrição de nenhum deploy não foi integralmente atendida: a integração Git acionou previews automáticos, conforme detalhado abaixo.

| Verificação | Evidência / resultado |
| --- | --- |
| Sessão | Sessão Chrome autenticada existente, reutilizada sem ler/exportar credenciais |
| Repositório | `MarioSerafimCoder/portfolio-oficial` |
| Base/main inicial e final | `34af157ed5123195b4ab73dce9770934733c4898` — inalterada |
| Branch exclusiva | `codex/cms-editorial-qa-20261030` |
| Artigo temporário | `src/content/posts/qa-blocos-editoriais-20261030.md`, `status: draft`, `demo: true`, sem data de publicação |
| Ciclo 1 | Source → Editor → Source → salvar → sair para a coleção → reabrir: conteúdo preservado |
| Ciclo 2 | Edição em Source, edição adicional no Editor, retorno a Source, salvar/sair/reabrir: conteúdo preservado |
| Ciclo 3 | Nova edição no Editor, retorno a Source, salvar/sair/reabrir e recarregar completamente: conteúdo preservado |
| Integridade | `[!QUOTE]`, `[!IMPACT]`, `[!AUTHOR]`, 4 negritos, 1 ênfase, 5 links, atribuição e parágrafos mantidos |
| Normalização | CMS remove a quebra de linha final; comparações usam somente `trimEnd()`. Nenhuma perda de conteúdo editorial |
| Frontend | 1440, 390 e 320 px; temas claro e escuro; seis combinações aprovadas |
| Semântica | `figure > blockquote` com `figcaption`, `div` de impacto e `aside[role=note]` |
| Layout e acessibilidade | Sem overflow horizontal, sem erros de página/hidratação na instância limpa, zero violações axe WCAG 2 A/AA e 2.1 AA no conteúdo do artigo |
| Regressões | 88 testes Node aprovados; TypeScript `--noEmit` aprovado |

## Defeitos encontrados e correções

1. `.pages.yml` tinha `label: Enquadramento da capa (ex.: 50% 35%)` sem aspas. O formulário hospedado falhava com React #31 ao tratar o rótulo como objeto; o parser YAML local também rejeitava a configuração. Rótulo corrigido com aspas no workspace e exclusivamente na branch de teste. A configuração de teste recebeu as opções `format: markdown` e `switcher: true` já preparadas localmente. Teste de regressão valida o YAML real, os rótulos e essas opções.
2. HTML literal dentro de uma nota do autor produzia um `pre` horizontalmente rolável sem foco por teclado em 320 px. `tabIndex={0}` foi acrescentado aos blocos `pre` de Markdown/HTML literal. Nova execução axe aprovada. HTML continua sendo texto e não é executado.
3. O servidor de desenvolvimento preexistente em 3000 entregava HTML antigo com blockquotes comuns e hidratava componentes novos. Isso não se reproduziu numa cópia limpa dos fontes com servidor Next separado. Nenhuma alteração de produto foi feita para mascarar esse estado de cache.

As correções do frontend permanecem locais. A correção YAML feita remotamente existe somente na branch de teste; `main` não foi corrigida nesta execução.

## Evidências

- [Comparações integrais dos três ciclos](cms-cycles.json), com conteúdo inicial e conteúdo lido após cada reabertura.
- [Source após o terceiro ciclo](cms-source.png) e [Editor visual após o terceiro ciclo](cms-editor.png).
- [Resultados das seis renderizações, tipografia e axe](rendering.json).
- [Desktop claro](1440-light.png), [desktop escuro](1440-dark.png), [mobile claro](390-light.png), [mobile escuro](390-dark.png), [320 claro](320-light.png), [320 escuro](320-dark.png).
- [Isolamento comprovado pelo GitHub](github-isolation.json): somente `.pages.yml` e o artigo temporário diferem de `main`; nenhum artigo existente foi modificado.
- Fixture real reaberta no CMS: `tests/fixtures/editorial-pages-cms-roundtrip.md`. O teste correspondente verifica os três blocos, parágrafos, links, negritos, atribuição e edições visuais no parser do frontend.

## Publicação, restrições e limitações

O projeto armazena artigos em `src/content/posts`, com YAML frontmatter. O CMS grava commits Git; `scripts/build-posts.mjs` filtra rascunhos e datas futuras. O projeto tem integração Git com Cloudflare Pages e agendamento por Worker. Nenhum hook, Cron ou comando de deploy foi executado pelo agente; nenhuma configuração de segurança foi alterada.

**Ocorrência contrária à restrição de deploy:** os commits necessários do CMS acionaram automaticamente previews Cloudflare na branch de teste. O check do último commit registra `Deployed successfully`. Isso deveria ter sido verificado antes da primeira gravação. Não equivale a afirmar que nenhum deploy ocorreu. Evidência em [deployment-observation.json](deployment-observation.json). O artigo temporário respondeu **404 tanto no preview quanto em produção** e continuou em rascunho. `main` ficou no mesmo SHA.

Foram gerados quatro commits pelo próprio CMS: um para configuração e três para criação/edição do artigo. Nenhum commit local, merge ou push local foi realizado. O rascunho e a branch remotos foram preservados como evidência isolada, sem novas gravações remotas após identificar os previews automáticos. A rota local temporária e os diretórios de aplicação criados durante os testes foram removidos; fixtures, testes e evidências foram mantidos.

Não foi feita auditoria completa do site nem teste com leitor de tela físico. O axe foi limitado ao conteúdo do artigo, com o consentimento de analytics recusado no perfil descartável do navegador. O endpoint de newsletter não existe no Next dev e apresentou o estado indisponível esperado, fora do escopo dos blocos. Não houve homologação do frontend em produção. Não foi necessário simular bibliotecas do CMS: o ciclo editorial foi executado na versão hospedada real, cuja versão interna exata não foi identificada.

O campo e o seletor Editor/Source seguem a [documentação oficial do Pages CMS](https://pagescms.org/docs/configuration/fields/rich-text/). O código público atual usa Tiptap; isso não foi usado como prova da versão implantada. Não foram chamadas APIs internas de gravação nem mecanismos alternativos de autenticação.

## Execução automatizada preservada

`node tests/editorial-rendering.mjs` cria uma cópia temporária isolada dos fontes, reutiliza `node_modules` e assets por junction, inicia Next em `127.0.0.1:3014`, testa com Puppeteer/Chrome e axe já instalados, salva screenshots/JSON, encerra seu próprio servidor e remove apenas sua cópia. Não adiciona dependências nem cria um artigo publicável. A fixture de rota fica em `tests/fixtures/editorial-qa-page.tsx.txt`. `TEST_ORIGIN` permite testar uma instância preparada externamente.

Conclusão editorial: os três blocos preservaram conteúdo nos três ciclos reais do CMS hospedado. A aprovação aplica-se à configuração corrigida da branch isolada; a ocorrência de previews automáticos fica registrada separadamente como descumprimento da restrição operacional.
