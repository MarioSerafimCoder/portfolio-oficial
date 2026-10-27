# Portfólio Mário Serafim

Portfólio oficial de Mário Serafim, desenvolvido em Next.js App Router, React, TypeScript e CSS próprio. Site público: [marioserafim.com.br](https://marioserafim.com.br/).

## Executar

Requer Node.js 24 e pnpm 10 (mesmas versões do Cloudflare Pages).

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

Abra http://127.0.0.1:3000. Para gerar a versão estática usada na publicação:

```sh
pnpm run build
```

O resultado fica em `out/`. A produção usa Cloudflare Pages, projeto `portfolio-oficial`, branch `main`. `.openai/hosting.json` é um registro da hospedagem anterior.

As versões em português e inglês usam traduções estáticas. As traduções já salvas permanecem no site; novas traduções são feitas e revisadas manualmente. A Google Translation API está desativada no pipeline e no projeto Cloud. Veja [internacionalização](docs/INTERNATIONALIZATION.md) e o [fluxo offline de revisão](docs/TRANSLATIONS_OFFLINE.md).

## Verificar

```sh
pnpm run check
pnpm test
```

Relatórios Lighthouse e verificação responsiva locais ficam em `docs/validation/`.

## Conteúdo e manutenção

- `src/content/projects.ts`: cases, narrativas, créditos, cores e fontes do material.
- `src/content/site.ts`: apresentação, contato, redes sociais, faixas de investimento e FAQ.
- `src/content/posts/*.md`: artigos editados pelo Pages CMS; `src/content/journal.ts` reúne o conteúdo gerado, categorias e demonstração (veja [manutenção do blog](docs/JOURNAL.md)).
- `src/app/sobre/page.tsx`: trajetória e abordagem editorial.
- `src/app/globals.css`: tokens, composição, responsividade e animações.
- `public/media/`: derivados WebP e vídeos dos cases, incluindo versões menores para mobile. A home apresenta apenas imagens estáticas dos projetos. Originais de trabalho ficam em `tmp/`, fora do Git.
- `public/fonts/`: Instrument Serif e DM Sans locais, com licenças OFL.

Ao adicionar imagens, informe suas dimensões reais em `src/content/media-dimensions.json` e descrições alternativas no conteúdo do case. Preserve os créditos e diferencie aplicações simuladas de produtos fabricados.

## Contato e publicação

O formulário organiza um briefing em duas etapas e envia a mensagem por um [Google Apps Script](integrations/gmail-contact/README.md) para `contato@marioserafim.com.br`. Inclui cópia do texto, link de e-mail e download `.eml` como alternativas. O destino é fixo no código do Apps Script. Links de Instagram, Behance, LinkedIn e WhatsApp ficam em `src/content/site.ts`; agendamento, newsletter e métricas só aparecem após configuração. Nenhuma credencial é incluída no site.

O domínio oficial dos metadados é `https://marioserafim.com.br`. Configure `NEXT_PUBLIC_SITE_URL` com esse valor no Pages (veja `.env.example`). A publicação automática e sua recuperação estão documentadas em [infraestrutura do blog](docs/BLOG_INFRASTRUCTURE.md).

Veja o [relatório da evolução atual](docs/EVOLUTION_REPORT.md), o [registro de produção dos vídeos](docs/FLOW_PRODUCTION.md), a [verificação de conteúdo](docs/CONTENT_VERIFICATION.md) e a [auditoria da referência](COLLINS_REFERENCE_AUDIT.md). O [relatório de entrega anterior](docs/DELIVERY_REPORT.md) permanece como histórico da reconstrução inicial.
