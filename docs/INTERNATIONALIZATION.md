# Tradução estática — português e inglês

O idioma vem da URL e as páginas são geradas como arquivos estáticos. As rotas em português continuam sendo a fonte do blog; as rotas inglesas usam traduções versionadas quando disponíveis. Uma tradução ausente não bloqueia a geração ou publicação do original em português.

## Rotas

| Português | Inglês |
| --- | --- |
| `/` | `/en` |
| `/sobre` | `/en/about` |
| `/projetos` | `/en/projects` |
| `/projetos/<slug>` | `/en/projects/<slug>` |
| `/contato` | `/en/contact` |
| `/privacidade` | `/en/privacy` |
| `/blog` | `/en/blog` |
| `/blog/<slug>` | `/en/blog/<mesmo-slug>` |
| `/blog/categoria/<id>` | `/en/blog/category/<mesmo-id>` |

Os slugs de artigos e identificadores de categorias são preservados. O seletor mantém a página correspondente e a preferência local não altera o idioma de uma URL compartilhada. Uma rota inglesa só é publicada para conteúdo traduzido e atual.

## Arquivos

- `src/i18n/state.json`: memória e histórico versionados, incluindo as traduções existentes e o contador histórico de caracteres.
- `src/i18n/editorial/site.json`: traduções manuais de textos da interface.
- `src/i18n/reviews/<slug>.md`: rascunhos e revisões manuais do blog.
- `src/i18n/en/site.json`, `src/i18n/en/posts.json` e `src/i18n/manifest.json`: arquivos estáticos derivados para o site.

## Traduções sem chamadas pagas

Não há tradução automática no build nem no workflow do GitHub Actions. `.github/workflows/translations.yml` só pode ser executado manualmente e não recebe segredos de tradução. O caminho legado `--apply` é bloqueado antes de qualquer chamada de rede. No Google Cloud, o faturamento foi desvinculado do projeto e a Cloud Translation API foi desativada.

Para revisar ou adicionar uma tradução de artigo:

```sh
pnpm i18n:review <slug-do-artigo>
```

O comando cria um arquivo a partir do texto inglês existente ou, quando ele ainda não existe, do original em português. Edite os campos e o corpo, mantenha `source_hash` e marque `review_status: reviewed` depois da revisão. Execute `pnpm run build` para gerar os arquivos estáticos.

Para mensagens da interface, adicione ou atualize o par original/inglês em `src/i18n/editorial/site.json` e rode `pnpm i18n:sync`. O build público não exige chave, conexão com o Google nem disponibilidade de serviço de tradução.

Veja o guia [offline de tradução e revisão](TRANSLATIONS_OFFLINE.md) para o processo editorial e a avaliação de um modelo local.

## Testes

`pnpm test` verifica rotas, extração, contagem histórica, preservação de Markdown, revisão e a ausência de chamadas pagas. Os testes usam provedores simulados; não chamam a Google Translation API.
