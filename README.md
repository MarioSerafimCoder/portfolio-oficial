# Portfólio Mário Serafim

Reconstrução em Next.js App Router, React, TypeScript e CSS próprio. Branch: `rebuild/collins-editorial`.

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
- `public/media/`: derivados WebP e vídeo dos arquivos autorizados. Originais de trabalho ficam em `tmp/`, fora do Git.
- `public/fonts/`: Instrument Serif e DM Sans locais, com licenças OFL.

Ao adicionar imagens, informe suas dimensões reais em `src/content/media-dimensions.json` e descrições alternativas no conteúdo do case. Preserve os créditos e diferencie aplicações simuladas de produtos fabricados.

## Contato e publicação

O formulário organiza um briefing em três etapas e prepara um e-mail para `marioserafim.da@gmail.com`. Inclui cópia do texto e download `.eml`. O visitante realiza o envio em seu aplicativo de e-mail; não há endpoint de envio, banco de dados ou coleta silenciosa.

O endereço Sites está configurado como origem padrão dos metadados. Se mudar o domínio, configure `NEXT_PUBLIC_SITE_URL` e faça novo build (veja `.env.example`). Para envio automático, será necessário configurar um serviço transacional e proteção contra abuso; isso não foi simulado.

Veja o [relatório de entrega](docs/DELIVERY_REPORT.md), a [verificação de conteúdo](docs/CONTENT_VERIFICATION.md) e a [auditoria da referência](COLLINS_REFERENCE_AUDIT.md).
