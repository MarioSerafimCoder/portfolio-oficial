# Redesign editorial — Pausa do café

## Entrega

- Assinatura compacta sob o resumo, com retrato real do autor em enquadramento fechado no rosto, data, tempo de leitura e botão de compartilhamento. O retrato também aparece na assinatura expandida ao fim dos artigos. Conteúdos marcados `demo: true` permanecem no CMS e mantêm suas rotas antigas com `noindex`, mas não aparecem nas listagens públicas.
- Assinatura expandida no fim do artigo, com biografia e links para o portfólio e o LinkedIn.
- Índice obrigatório removido. H2 e H3 continuam com IDs gerados a partir dos títulos.
- Cards relacionados em duas colunas no desktop e empilhados no celular, com capa, categoria, título, resumo, tempo de leitura e seta. O CMS agora aceita `cover_position` para ajustar o recorte; artigos sem capa recebem um fallback tipográfico.
- Ordem do encerramento: compartilhamento, assinatura expandida, artigos relacionados, newsletter e rodapé institucional. O convite comercial é omitido somente no rodapé de artigos.
- Estilos usam os tokens da identidade do site nos temas claro e escuro, com foco visível, transições discretas e suporte a `prefers-reduced-motion`.
- Título, descrição, canonical, Open Graph, Twitter Cards e Article JSON-LD foram preservados; os dados estruturados identificam o autor e seu LinkedIn.

## Newsletter e configuração pendente

A inscrição usa uma Cloudflare Pages Function em `functions/api/newsletter.ts` e a API oficial da Buttondown. A chave privada nunca chega ao navegador. A função valida origem, JSON, tamanho do corpo, e-mail, campo honeypot e consentimento; registra data/hora e a origem do consentimento; encaminha o IP da requisição quando a Cloudflare o fornece; e pede confirmação por e-mail usando o estado `unactivated`. A interface só informa que o pedido está aguardando confirmação quando a API devolve um novo registro nesse estado. O provedor trata colisões e aplica seus próprios controles de spam e rate limit. O site não mantém uma lista local nem envia automaticamente newsletters quando um artigo é publicado.

**Configuração de produção:** `BUTTONDOWN_API_KEY` está gravado como Secret criptografado no ambiente Production do projeto Cloudflare Pages `portfolio-oficial`. Após salvar o Secret, a implantação `c066a960-5599-4148-8974-a5030f150383` foi concluída. `GET /api/newsletter` responde `available: true`, liberando o formulário nos artigos. A chave não é incluída no repositório nem enviada ao navegador. Para substituir a chave, atualize o Secret em Settings → Variables and Secrets e faça uma nova implantação.

O descadastro é administrado pelo link incluído nas mensagens da Buttondown. Os dados tratados e o fornecedor estão descritos na página de privacidade. O escopo atual tem proteção de origem, honeypot, limite de corpo e controles do provedor; não há um contador persistente de envios próprio no Pages.

Referências técnicas: [criação de assinantes e confirmação dupla](https://docs.buttondown.com/api-subscribers-create), [autenticação da API](https://docs.buttondown.com/api-authentication), [roteamento de Pages Functions](https://developers.cloudflare.com/pages/functions/routing/).

## Validação

- `pnpm run check`: aprovado.
- `pnpm test`: 38 testes aprovados.
- `pnpm run build`: exportação estática aprovada, com três artigos publicados e o artigo de demonstração preservado.
- Lighthouse (acessibilidade e SEO): 100/100 nas larguras de 320, 375, 768, 1024 e 1440 px, com a disponibilidade da função simulada apenas por um binding local de teste.
- Inspeção de HTML exportado em artigos com e sem capa: um H1, ausência do índice antigo, IDs de títulos, sequência editorial e rodapé institucional.
- Smoke tests locais: sem Secret, `GET /api/newsletter` retornou `available: false` e `POST` foi recusado com HTTP 503 `not_configured`; com uma chave fictícia somente local, a interface apareceu, enquanto payload inválido, e-mail inválido e honeypot foram recusados com HTTP 400. Em produção, `GET /api/newsletter` responde `available: true`; uma requisição de validação com e-mail deliberadamente inválido recebeu HTTP 422 da Buttondown. Nenhuma inscrição real ou e-mail de confirmação foi enviado.
- Não existe script `lint` no `package.json`.
- O preview também foi aberto no navegador interno do Codex. As configurações do Work bloquearam a automação visual dessa janela; a revisão visual complementar foi feita por capturas headless em 390 px (tema escuro) e 1440 px (tema claro).

## Arquivos desta entrega

- `.pages.yml`, `scripts/build-posts.mjs`, `src/content/journal.ts`: enquadramento de capa configurável via CMS.
- `functions/api/newsletter.ts`: integração protegida e configurável com Buttondown.
- `src/components/journal-article.tsx`, `src/components/journal-author-signature.tsx`, `src/components/journal-share.tsx`, `src/components/newsletter.tsx`, `src/components/shell.tsx`: componentes e sequência da página.
- `src/app/blog/[slug]/page.tsx`, `src/app/blog/blog.css`, `src/content/journal-i18n.ts`: metadados, estilos e conteúdo localizado.
- `src/app/privacidade/page.tsx`: transparência sobre dados e provedor.
- `docs/JOURNAL.md`: instruções atualizadas para edição e configuração.

O rebuild regenera `src/content/journal-generated.json`; esse arquivo já tinha alterações locais antes desta entrega e foi mantido fora do escopo de versionamento. Também não foram incluídas alterações preexistentes do agendador do blog, seus testes ou o relatório anterior de melhorias.
