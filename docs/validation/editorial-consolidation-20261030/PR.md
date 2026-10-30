# Adiciona blocos editoriais de citação, impacto e nota do autor

O blog passa a renderizar `[!QUOTE]`, `[!IMPACT]` e `[!AUTHOR]` a partir de parágrafos de citação Markdown. Citações usam `figure`, `blockquote` e crédito opcional em `figcaption`; frases de impacto e notas do autor recebem estilos próprios, com rótulo localizado em português/inglês. Links, negritos, parágrafos, citações convencionais e notas antigas mantêm o fluxo existente. HTML bruto continua literal e URLs continuam passando pela validação existente.

Corrige o rótulo YAML com dois-pontos que quebrava o formulário Pages CMS, explicita Markdown/Editor/Source e permite foco por teclado nos blocos de código roláveis. Inclui fixtures da homologação real e regressões, sem dependências novas ou alterações em artigos, agendamento, infraestrutura ou regras de publicação.

Validação: 88/88 testes Node, TypeScript, build estático isolado e validação de 38 documentos HTML aprovados. Artigos gerados idênticos ao baseline. Doze combinações de idioma (PT/EN), viewport (1440/390/320) e tema passaram em Chromium/axe, com SSR, rótulos e foco verificados, sem overflow, erros de página ou violações WCAG A/AA no conteúdo testado. A etapa anterior comprovou três ciclos reais de salvar/reabrir no CMS hospedado; seus registros foram preservados.

O rascunho remoto `qa-blocos-editoriais-20261030.md` está excluído deste diff. Não fazer merge direto da branch de QA: ela contém esse rascunho e não contém a implementação completa do frontend.

Esta descrição está preparada localmente. Nenhum PR/push foi enviado nesta etapa, pois a integração Cloudflare dispara previews. A consulta de configuração atual retornou 401; não foi possível confirmar uma exclusão segura para a nova branch. Consulte [o relatório e o procedimento de integração](REPORT.md) antes de publicar a branch ou integrar em `main`.
