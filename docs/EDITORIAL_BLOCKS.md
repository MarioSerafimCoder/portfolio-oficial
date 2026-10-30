# Blocos editoriais

**Atualização de 30/10/2026:** a homologação real do Pages CMS foi executada em branch isolada, com três ciclos aprovados de salvar e reabrir, incluindo edição visual. O [relatório de homologação](validation/editorial-cms-20261030/REPORT.md) e suas evidências substituem as pendências históricas abaixo. Foram corrigidos o rótulo YAML que impedia abrir o formulário e o foco de blocos de código. Os commits do CMS acionaram previews automáticos Cloudflare; essa ocorrência contrária à restrição de deploy está registrada no relatório. A branch principal não foi alterada.

O Pages CMS usa `.pages.yml`, campo `body` rich-text e arquivos Markdown com frontmatter. `scripts/build-posts.mjs` produz conteúdo legado e uma árvore mdast, renderizada por `MarkdownContent`. HTML bruto continua aparecendo como código literal; URLs passam pela validação existente.

Insira no modo Source do campo de conteúdo. Mantenha uma linha de citação vazia depois do marcador e antes da atribuição. No editor visual, são parágrafos separados dentro da mesma citação. Não dependemos de extensões do menu `/`.

```markdown
> [!QUOTE]
>
> Texto **citado**.
>
> — Nome da pessoa, [Fonte](https://example.com)

> [!IMPACT]
>
> Uma ideia que merece **destaque**.

> [!AUTHOR]
>
> Observação pessoal do autor.
```

Autoria e fonte são opcionais: omita o último parágrafo da citação. A frase de impacto usa um div, a nota usa aside com role note, e apenas a citação usa blockquote com figcaption para o crédito. Citações sem marcadores e notas antigas continuam funcionando. Marcadores desconhecidos ou incompletos não são consumidos. Não alteramos artigos existentes, assinatura lateral ou o modelo do CMS.

A homologação real foi concluída no Pages CMS hospedado: três ciclos de edição, alternância Editor/Source, salvamento e reabertura preservaram os blocos, links, negritos, atribuição e parágrafos. A normalização observada foi somente a remoção da quebra de linha final. O editor visual mostra blockquotes comuns; os estilos editoriais são aplicados pelo frontend.

Evidências e limites: [relatório da homologação](validation/editorial-cms-20261030/REPORT.md). Os previews automáticos disparados naquela etapa estão registrados; não se deve confundir a aprovação dos blocos com cumprimento da restrição operacional de nenhum deploy.

A consolidação está descrita no [relatório de integração](validation/editorial-consolidation-20261030/REPORT.md). O rascunho remoto de QA não faz parte do diff definitivo. As fixtures em tests/fixtures são dados de regressão, não artigos publicáveis. O teste de renderização cria sua própria aplicação temporária e a remove ao terminar; as evidências históricas permanecem preservadas.

Referência: [campo rich-text do Pages CMS](https://pagescms.org/docs/configuration/fields/rich-text/). Nenhuma dependência foi adicionada.
