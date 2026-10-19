# Portfólio Mário Serafim

Portfólio oficial de Mário Serafim, desenvolvido em Next.js App Router, React, TypeScript e CSS próprio. Site público: [mario-serafim-portfolio-2026.mario-92.chatgpt.site](https://mario-serafim-portfolio-2026.mario-92.chatgpt.site/).

## Executar

Requer Node.js 24 e npm.

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:3000. Para gerar a versão estática usada na publicação:

```sh
npm run build
```

O resultado fica em `out/`. A configuração de hospedagem está em `.openai/hosting.json`.

## Verificar

```sh
npm run check
npm test
```

Relatórios Lighthouse e verificação responsiva locais ficam em `docs/validation/`.

## Conteúdo e manutenção

- `src/content/projects.ts`: cases, narrativas, créditos, cores e fontes do material.
- `src/content/site.ts`: apresentação, e-mail, LinkedIn e serviços.
- `src/app/sobre/page.tsx`: trajetória e abordagem editorial.
- `src/app/globals.css`: tokens, composição, responsividade e animações.
- `public/media/`: derivados WebP, vídeos dos cases e showreel preparados a partir dos arquivos autorizados. Originais de trabalho ficam em `tmp/`, fora do Git.
- `public/fonts/`: Instrument Serif e DM Sans locais, com licenças OFL.

Ao adicionar imagens, informe suas dimensões reais em `src/content/media-dimensions.json` e descrições alternativas no conteúdo do case. Preserve os créditos e diferencie aplicações simuladas de produtos fabricados.

## Contato e publicação

O formulário organiza um briefing em três etapas e envia a mensagem por um [Apps Script do Gmail](integrations/gmail-contact/README.md) para `marioserafim.da@gmail.com`. Inclui cópia do texto, link de e-mail e download `.eml` como alternativas. O destino é fixo no código do Apps Script; o site não inclui credenciais, banco de leads ou analytics de formulário.

O endereço Sites está configurado como origem padrão dos metadados. Se mudar o domínio, configure `NEXT_PUBLIC_SITE_URL` e faça novo build (veja `.env.example`). A publicação usa o projeto declarado em `.openai/hosting.json`.

Veja o [relatório da evolução atual](docs/EVOLUTION_REPORT.md), o [registro de produção dos vídeos](docs/FLOW_PRODUCTION.md), a [verificação de conteúdo](docs/CONTENT_VERIFICATION.md) e a [auditoria da referência](COLLINS_REFERENCE_AUDIT.md). O [relatório de entrega anterior](docs/DELIVERY_REPORT.md) permanece como histórico da reconstrução inicial.
