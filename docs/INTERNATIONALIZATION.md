# Tradução estática — português e inglês

## Diagnóstico e arquitetura

Antes desta implementação, `journal-preferences.tsx` trocava apenas textos da interface por estado/localStorage. `journal-i18n.ts` continha traduções manuais, incluindo uma demonstração de artigo, mas `build-posts.mjs` não incorporava traduções dos artigos Markdown. Home, Sobre, projetos, contato e privacidade tinham textos portugueses diretamente no JSX. O visitante podia escolher EN e continuar lendo o artigo em português na mesma URL.

Agora o idioma é determinado pela URL, também na primeira resposta HTML. Os layouts raiz em `src/app/(pt)` e `src/app/(en)/en` emitem `lang="pt-BR"` e `lang="en"`. As views compartilhadas em `src/views` mantêm os layouts. Os componentes usam o mesmo contexto de idioma já existente, ampliado para o portfólio inteiro; não existe widget, substituição do DOM nem chamada de tradução na navegação.

| Português preservado | Inglês |
| --- | --- |
| `/` | `/en` |
| `/sobre` | `/en/about` |
| `/projetos` | `/en/projects` |
| `/projetos/<slug>` | `/en/projects/<slug>` |
| `/contato` | `/en/contact` |
| `/privacidade` | `/en/privacy` |
| `/materiais` | `/en/resources` (continua sem indexação) |
| `/blog` | `/en/blog` |
| `/blog/<slug>` | `/en/blog/<mesmo-slug>` |
| `/blog/categoria/<id>` | `/en/blog/category/<mesmo-id>` |

Os slugs de artigos e identificadores de categorias são preservados deliberadamente. Não se paga para traduzir identificadores e não se criam aliases instáveis. `/trajetoria` continua redirecionando para `/sobre`.

O seletor mantém a página correspondente. O armazenamento local registra a escolha explícita, mas nunca sobrescreve o idioma de uma URL compartilhada nem redireciona automaticamente visitantes. Sem tradução publicada, não se fabrica uma URL inglesa: o original continua disponível. O índice inglês lista apenas artigos com tradução completa e atual. HTML, canonical, alternates, Open Graph, Twitter, RSS e sitemap usam o idioma e os destinos correspondentes.

## Mapa dos conteúdos

- Home: headline, manifesto, projetos destacados, serviços, processo, FAQ e contato.
- Sobre: introdução, trajetória, formação, processo e CTAs.
- Projetos: filtros, listas, descrição de todos os cases, galeria, legendas, créditos, alt e navegação.
- Contato: etapas, campos, validação, feedback, botões e privacidade. O contrato de envio existente continua com seus valores internos portugueses.
- Blog: busca, categorias, listagem, título, resumo, SEO, capa, corpo Markdown completo, links, legendas, referências e compartilhamento.
- Newsletter: somente tradução dos textos, inclusive o humor dos maias/astecas e das 37 abas; serviço, inscrição e confirmação permanecem como antes.
- Elementos comuns: menu, rodapé, preferências de cookies, acessibilidade, tema, WhatsApp, erros e páginas indisponíveis.

`scripts/i18n/extract.mjs` usa a AST TypeScript para catalogar strings, sem executar o código das páginas. Novos componentes devem usar `i18nText`/`i18nHref`; dados editoriais de projetos e serviços continuam em seus arquivos atuais. O extrator não constitui tradução automática do DOM.

## Arquivos persistentes

- `src/i18n/state.json`: memória por segmento, documentos, hashes, versões, revisões, reservas mensais e falhas. É estado administrativo versionado, não importado no bundle público.
- `src/i18n/source/site.json`: catálogo português extraído deterministicamente.
- `src/i18n/en/site.json`, `en/posts.json`, `manifest.json`: conteúdo público derivado, sem contador nem credenciais.
- `src/i18n/editorial/site.json`: decisões editoriais aprovadas para mensagens fixas, nomes próprios e headlines. Têm prioridade sobre a máquina.
- `src/i18n/templates.json`: mensagens variáveis revisadas, com placeholders que preservam nomes e números.
- `src/i18n/reviews/<slug>.md`: revisão manual de um artigo inglês, acessível na coleção **Revisões em inglês** do Pages CMS.
- `i18n-reports/status.md` e `.json`: diagnóstico local/CI, ignorado pelo Git e não publicado. Também aparece no resumo do Actions e como artifact privado de diagnóstico conforme o acesso ao repositório.

As traduções manuais de `journal-i18n.ts` e do artigo demonstrativo foram preservadas. Os textos novos da newsletter inglesa foram ajustados ao conteúdo português atual.

## Fluxo automático

1. Pages CMS faz o commit de um artigo original em `main`.
2. Cloudflare Pages pode publicar imediatamente o original, sem depender do Google.
3. `.github/workflows/translations.yml` identifica mudanças nas fontes e roda em um único grupo de concorrência, sem cancelamento de uma chamada em curso.
4. A sincronização lê o estado financeiro mais recente de `main`, calcula o hash, reaproveita segmentos salvos e faz uma estimativa de todos os segmentos necessários antes da primeira chamada.
5. Antes de **cada tentativa** da API, grava e envia uma reserva no GitHub. Se esse push falhar, a chamada não ocorre. Em cada lote bem-sucedido, salva a memória antes do próximo lote.
6. A tradução estruturada é validada e persistida. O commit final disponibiliza os artefatos ingleses para o próximo deploy da integração Git.

Commits intermediários começam com `[skip ci]`, evitando builds do Pages por reserva. O commit final não usa esse prefixo. Commits do bot não acionam uma nova sincronização de tradução. As permissões do workflow ficam em `contents: write`; não são necessárias credenciais Cloudflare para traduzir.

Rascunhos não consomem a API. Artigos agendados podem ser preparados antes da data, mas `build-posts.mjs` continua respeitando a publicação programada. Nenhuma sincronização apaga o original, artigos ou traduções aprovadas.

## Executar e conferir

```sh
pnpm i18n:sync             # extrai, estima e gera relatório; sem chamadas à API
pnpm i18n:extract          # atualiza o catálogo
pnpm build                # totalmente independente da chave/API
pnpm test
```

`npm run i18n:sync` também funciona em ambientes com npm instalado. O projeto utiliza pnpm no Pages e no Actions.

Para efetivamente traduzir, execute **Static English translations → Run workflow** no GitHub ou edite um conteúdo de origem. `--apply` é aceito apenas no workflow serializado com `I18N_PERSIST_GIT=1`: permitir gasto local paralelo à CI deixaria de oferecer a trava global do orçamento. Uma trava de arquivo também impede duas sincronizações simultâneas no mesmo checkout. Não remova uma trava enquanto houver um processo ativo.

O relatório informa artigos existentes/traduzidos/pendentes/desatualizados, hashes de origem, falhas, estimativa, consumo, saldo e última sincronização. A execução sem alterações deve apresentar **0 caracteres estimados e nenhuma requisição**.

## Revisão editorial de artigos

```sh
pnpm i18n:review design-nao-e-so-o-que-voce-ve
```

A sincronização real cria automaticamente um rascunho de revisão no CMS para cada artigo traduzido. O comando acima também permite criar um arquivo que ainda não exista e recusa sobrescrever trabalho anterior. O Markdown contém o texto salvo, o `source_hash` correspondente e `review_status: draft`. Edite no arquivo ou no Pages CMS. Marque `review_status: reviewed` após a revisão, preservando o slug/filename e o hash do original efetivamente revisado. Faça commit.

Uma revisão aprovada nunca é sobrescrita automaticamente. Quando o original muda, a revisão é marcada **stale/desatualizada**, o arquivo permanece intacto e a rota inglesa deixa de ser anunciada até ser atualizada e aprovada com o novo hash. Para retomar a geração automática intencionalmente, remova a aprovação no arquivo e redefina explicitamente o estado do documento de `reviewed/stale` para `pending`, sem alterar o contador mensal. Isso é uma decisão editorial, não uma consequência automática do build.

Revisões podem ajustar ironia e naturalidade; a máquina NMT é apenas a primeira versão. A API não recebe instruções criativas nem inventa adaptação editorial. Nomes conhecidos são protegidos por tokens validados, e títulos de referências bibliográficas ficam preservados.

## Markdown e limites conhecidos

O pipeline analisa Markdown CommonMark com `mdast-util-from-markdown`; altera somente nós textuais, alt/legendas e campos editoriais permitidos do frontmatter. Destinos de links/imagens, definições, código inline/fenced, listas, ênfase e metadados factuais ficam preservados. A serialização é validada por comparação estrutural, inclusive URLs e código, e por uma segunda análise do resultado.

O leitor usa a árvore estruturada; não injeta HTML fornecido pela tradução. A formatação Markdown passa a ser preservada também no português, em vez de se perder no conversor antigo. A representação de blocos anterior permanece para busca, leitura estimada e compatibilidade.

Raw HTML/MDX/embeds são preservados literalmente, nunca enviados como código à API ou executados como HTML arbitrário. Conteúdos com esses nós ficam `pending-review` após tradução e exigem revisão antes da rota inglesa. O repositório atual usa Markdown CommonMark; executar componentes MDX novos exige um renderer allowlisted próprio, não substituição por regex. Não se promete suporte à execução de MDX arbitrário.

Segmentos com mais de 5.000 code points bloqueiam a sincronização antes das chamadas; divida o parágrafo no original. Essa escolha preserva o contexto em vez de partir frases silenciosamente.

## Credencial privada

Configure `GOOGLE_TRANSLATE_API_KEY` em **Settings → Secrets and variables → Actions → Repository secrets**. O segredo já foi cadastrado nesta implantação. Nunca use `NEXT_PUBLIC_`, frontmatter, JavaScript público ou logs para a chave. O workflow envia a chave no cabeçalho privado `X-Goog-Api-Key`, não na URL. Não é necessário configurá-la no Cloudflare Pages.

A chave isolada permite traduzir, mas não administrar o projeto Google Cloud. No Console, restrinja-a à **Cloud Translation API**. Quando aplicável ao ambiente, restrinja a origem de chamadas por IP; runners hospedados do GitHub não têm um único IP fixo apropriado para uma regra estreita. Uma chave enviada em chat deve ser rotacionada. Troque o valor do mesmo Secret ao rotacionar.

## Orçamento e falhas

O teto é **400.000 caracteres por mês UTC** (`TRANSLATION_MONTHLY_LIMIT=400000`). A contagem usa code points de cada string efetivamente enviada, incluindo espaços e tokens de proteção, somados por destino/tentativa. O estado versionado mantém os meses anteriores; a virada do mês inicia apenas um novo acumulador. O sistema não aumenta o limite automaticamente. Valores inválidos ou superiores ao teto precisam de alteração explícita da política no código.

Há pré-validação do plano inteiro, reserva antes de cada tentativa, timeout de 20 s e no máximo três tentativas com backoff de 1 e 2 s para rede, 429 e 5xx. 403 não é repetido automaticamente. Falhas de validação de tokens protegidos também não são repetidas. Falhas/timeout mantêm a reserva, pois não é possível determinar com segurança se o Google cobrou. A API Basic não oferece idempotência: uma interrupção entre receber uma resposta e persistir a memória pode exigir nova chamada; a reserva anterior continua contabilizada.

Ao atingir 50%, 75%, 90% ou 100%, o estado registra o alerta uma única vez por nível/mês, com total, limite, percentual, saldo, quantidade de conteúdos e data. O resumo/artifact do Actions mostra esses alertas. **Não há serviço de e-mail de alertas configurado nem alegação de mensagens enviadas.** Notificações de falha do GitHub dependem das preferências da conta.

Ao bloquear: leia o relatório, preserve estado/cache e publique o original normalmente. Aguarde a virada UTC ou revise explicitamente a política. Não apague/reset o ledger para liberar gasto. Se houver falha de push, atualize o checkout e execute novamente no grupo de concorrência. Uma resposta 403 requer verificar ativação da API, permissão/restrição da chave e cotas; 429 permite retentativas limitadas dentro do mesmo teto.

O contador protege **este pipeline**, não outras aplicações que usem o projeto/chave. Uma reserva conservadora também não é extrato de cobrança real.

## Segunda proteção no Google Cloud

No projeto Google Cloud correto, acesse APIs & Services → Cloud Translation API → Quotas. Reduza **Characters sent to general model per project per day (v2/v3)** e o limite por minuto conforme seu uso. A cota diária padrão é ilimitada e reinicia à meia-noite do horário do Pacífico; isso não equivale ao teto mensal UTC do pipeline. Um limite diário de 12.000, por exemplo, soma no máximo 372.000 em 31 dias, mas pode exigir distribuir a carga inicial por dias. Não configure esse número sem considerar os outros usos do projeto.

Configure também um orçamento de faturamento com alertas. A documentação atual de spend caps não lista Cloud Translation entre os serviços cobertos; não trate um alerta de orçamento comum como bloqueio automático. A administração dessas cotas/faturamento não foi efetuada apenas com a chave de tradução.

Fontes oficiais consultadas: [API v2](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate), [cotas e limites](https://docs.cloud.google.com/translate/quotas), [orçamentos](https://docs.cloud.google.com/billing/docs/how-to/budgets), [spend caps](https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps), [skip de builds do Pages](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/).

## Recuperação e novos idiomas

Traduções e contador têm histórico no Git. Recupere o conteúdo de um arquivo específico se necessário, mas **não reverta reservas financeiras do mês** ao restaurar uma tradução antiga. Reexecute o relatório/build sem a API e confirme canonical/sitemap antes de publicar. A indisponibilidade do Google não interfere na leitura das traduções completas já salvas.

Para um terceiro idioma, adicione explicitamente os dicionários, rotas, estado por destino e estimativa multiplicada pelo número de destinos. O workflow atual traduz exclusivamente `pt → en` com modelo `nmt`; não habilite um destino novo por configuração implícita.

## Validação

Os testes usam transportes simulados, sem credenciais reais: novo artigo; cache sem chamadas; um parágrafo alterado; Markdown e código; revisão aprovada; 403/429/rede; teto mensal e retentativa no limite; persistência antes da chamada; alertas; contagem Unicode; trava de arquivo e concorrência do workflow; URLs, links, preferência, canonical e hreflang. Build e verificações de navegador complementam os testes. A execução inicial real e seu consumo devem ser conferidos no relatório do Actions, sem confundi-los com testes.
