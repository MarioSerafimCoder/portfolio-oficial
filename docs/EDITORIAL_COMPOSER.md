# Compositor visual de blocos editoriais

Implementado na branch local `codex/editorial-composer`, baseada na publicação `60ef417`. Rota: `/ferramentas/blocos-editoriais`. Nesta etapa não houve commit, push, merge ou deploy.

## Decisão: interface auxiliar (opção B)

O serviço hospedado exibiu **Pages CMS 2.1.8** no diálogo “About Pages CMS”. O campo `body` do projeto continua `rich-text`, `format: markdown`, `switcher: true`, sem mudanças em `.pages.yml`.

A investigação distinguiu três interfaces:

| Interface | O que permite | Limite para este projeto |
| --- | --- | --- |
| [Pages CMS hospedado: rich-text](https://pagescms.org/docs/configuration/fields/rich-text/) | Markdown/HTML, Editor/Source e opções de mídia | Não documenta snippets ou extensões de comandos `/` por `.pages.yml` |
| [Pages Editor independente](https://github.com/hunvreus/pagescms-editor/blob/3f0a19b7c7ced3774c0992e05c315d40533f80cf/src/components/ui/editor.tsx) | Prop `snippets`, com modelos adicionados à lista `/` | É uma API React do componente; não uma opção do CMS hospedado |
| [Campos personalizados](https://pagescms.org/docs/guides/creating-custom-field/) | Implementação e registro de componentes no código do CMS | Exige uma aplicação do CMS sob controle do desenvolvedor; não habilita extensão remota por configuração |

O [tipo EditorSnippet](https://github.com/hunvreus/pagescms-editor/blob/3f0a19b7c7ced3774c0992e05c315d40533f80cf/src/components/ui/slash-command/suggestion.tsx) contém `label`, `source` e formato Markdown/HTML. Os snippets inserem modelos pelo menu `/`; não são, por si, um formulário editorial personalizado nem uma prévia com o CSS do portfólio. O README/site podem estar atrasados em relação ao código, por isso a API foi conferida no commit indicado.

No [adaptador rich-text do Pages CMS](https://github.com/pages-cms/pages-cms/blob/6f4e860a35d934406580287e7042e5e111e207a1/fields/core/rich-text/edit-component.tsx), `FieldOptions` e os props transmitidos ao `Editor` não incluem `snippets`. Portanto, adicionar uma opção inventada à `.pages.yml` não configura o menu hospedado. O campo estruturado `block` do CMS representa outro modelo de dados; não foi usado para substituir o corpo Markdown já publicado.

Conclusão desta versão: não foi encontrada integração nativa oficialmente suportada para configurar esses três blocos no editor hospedado sem modificar a aplicação CMS. Implementamos a alternativa independente, sem fork, substituição de editor, injeção no DOM, autenticação, backend ou escrita no GitHub.

## Uso

1. Abrir o compositor e selecionar Citação, Frase de impacto ou Nota do autor.
2. Escrever em texto comum. Uma linha vazia separa parágrafos. Para citação, preencher autoria se desejar; “Adicionar fonte ou referência” revela nome e endereço opcionais.
3. Conferir a prévia e clicar em **Copiar bloco**.
4. No artigo no Pages CMS, abrir **Source**, colar entre os parágrafos e voltar para **Editor** para continuar escrevendo. O conteúdo só é salvo pelo fluxo normal do CMS.

A cópia inclui separação de parágrafos para evitar que citações adjacentes se juntem. Se a API de clipboard não estiver disponível, o compositor revela o bloco pronto e um botão “Selecionar bloco” para a cópia convencional. Ele **não insere diretamente no CMS**.

Cada tipo conserva seu próprio rascunho enquanto a página estiver aberta. Não há persistência: recarregar ou fechar a página perde os campos. O compositor escreve blocos, não artigos completos. Os campos são texto simples; Markdown digitado neles é preservado literalmente, sem interpretar códigos de formatação. Ainda não há toolbar visual de formatação inline. Links são gerados pelos campos de referência, com validação de HTTP/HTTPS.

## Implementação e preservação

- Prévia com o **mesmo MarkdownContent e os mesmos CSS do blog**, não uma reprodução aproximada. A assinatura lateral do autor não é montada ou modificada.
- Serialização por `mdast-util-to-markdown` e prévia por `mdast-util-from-markdown`, ambos já no projeto. Texto e rótulos viram nós de texto; links viram nós de link. Os marcadores mantêm `[!QUOTE]`, `[!IMPACT]`, `[!AUTHOR]` e a linha vazia homologada.
- A regra de crédito opcional do parser é respeitada, incluindo validação da ambiguidade de um último parágrafo iniciado por travessão numa citação sem crédito explícito.
- Arquivos em `src/tools` mantêm a ferramenta em português independente do catálogo das páginas traduzidas; o build confirmou o mesmo hash do catálogo e os três artigos traduzidos atuais. A rota não tem equivalente inglês, não entra no sitemap e é `noindex`.
- Os estilos novos são limitados ao compositor. Somente nessa página, o formulário comercial do rodapé é ocultado para manter o foco na escrita. Cabeçalho, tema e navegação do portfólio são reaproveitados. Os componentes compartilhados não foram alterados.
- Nenhum artigo, revisão, configuração CMS, assinatura, renderer existente, CSS editorial existente, dependência, lockfile ou infraestrutura foi alterado.

## Validação executada

- **97 testes Node aprovados**: os 88 anteriores mais 9 regressões do gerador. Cobrem os três marcadores, três ciclos de serialização, parágrafos/CRLF, autoria/fonte, URLs inválidas e texto com caracteres especiais/HTML literal.
- TypeScript aprovado. Não há script de lint neste projeto.
- Build completo `pnpm run build` com saída zero; **39 documentos HTML** validados, incluindo a nova ferramenta.
- **18 combinações de interface**: três tipos × desktop 1440/mobile 390 e 320 px × claro/escuro. Verificadas cópia real do texto gerado, compatibilidade com o parser, ausência de overflow e erros de página, zero violações axe WCAG A/AA no compositor, rascunhos independentes, URL inválida e fallback de clipboard negado.
- Evidências locais em `tmp/editorial-composer-validation`: screenshots e `browser.json`. Logs em `tmp/editorial-composer-build.log` e `tmp/editorial-composer-tests.log`. O harness usa o Chromium/Puppeteer e axe já disponíveis no ambiente de homologação; nenhuma biblioteca foi adicionada ao projeto.
- O build preservou os catálogos/manifestos de idiomas, os conteúdos gerados e as rotas antigas. Não houve gravação no CMS hospedado nesta etapa.

## Para edição inteiramente visual dentro do CMS

O serviço hospedado precisaria expor oficialmente a configuração de snippets/comandos ou um registro de extensões, e oferecer apresentação/editabilidade dos blocos editoriais. Outra possibilidade exigiria operar uma instância customizada, fora do escopo e não implementada. Enquanto isso, o compositor elimina a escrita manual de marcadores, mas mantém o passo de colar no Source.
