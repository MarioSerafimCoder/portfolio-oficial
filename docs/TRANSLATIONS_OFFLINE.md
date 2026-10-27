# Traduções sem chamadas pagas

O site é exportado como conteúdo estático. O build lê o estado versionado em `src/i18n/state.json`, aplica arquivos de revisão aprovados e gera os JSONs usados pelas rotas em português e inglês. O build não chama provedores de tradução.

O pipeline automático da Google Translation foi removido. O workflow restante só pode ser iniciado manualmente, valida o conteúdo offline e não recebe segredos de API. A opção legada `--apply` falha antes de qualquer chamada externa. Traduções já salvas continuam disponíveis.

## Criar ou revisar uma tradução de artigo

1. Execute `pnpm i18n:review <slug-do-artigo>`. O comando cria `src/i18n/reviews/<slug-do-artigo>.md` a partir da tradução existente ou, se ainda não houver uma, do texto original em português.
2. Edite título, resumo, campos de SEO, texto alternativo e corpo em inglês. Preserve `source_hash` e defina `review_status: reviewed` quando a revisão estiver pronta.
3. Execute `pnpm run build`. O build incorpora somente a tradução manual aprovada e gera os arquivos estáticos. Conteúdo em português continua sendo construído a partir da fonte original mesmo se a revisão estiver ausente.

Para textos da interface, adicione ou atualize o par original/inglês em `src/i18n/editorial/site.json` e execute `pnpm i18n:sync` para regenerar os artefatos.

## Tradução automática local

Argos Translate é uma opção de código aberto que executa localmente e oferece modelos para português e inglês. Adotá-lo exigiria baixar e manter o modelo local, revisar qualidade e testar a preservação de Markdown, nomes, links e estrutura. Não está integrado ao build nem ao GitHub Actions. Não usamos serviços de demonstração hospedados como alternativa.

Por prioridade de custo zero e revisão editorial, o fluxo atual permanece manual. Um runner de Actions pode consumir minutos ou armazenamento sujeitos aos limites da conta; portanto, não é tratado como custo zero garantido nem dispara automaticamente.
