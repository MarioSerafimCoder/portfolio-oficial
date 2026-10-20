# Refinamento local — UI, UX e conversão

Data: 19 de outubro de 2026. **Somente local, sem publicação ou alteração da implantação Apps Script.** Prévia: http://127.0.0.1:3000/ e contato: http://127.0.0.1:3000/#contato.

## Implementação

- Paletas semânticas claras e escuras conforme briefing, com tokens separados para bordas decorativas, contornos interativos, foco, acento, hover, erro, sucesso e desabilitado. As bordas de controles usam contraste maior que as divisórias para atender ao mínimo de 3:1.
- Seções antes permanentemente escuras agora respeitam o tema. Preferência inicial do sistema, script antes da renderização e persistência manual preservados.
- Headline original e fontes locais preservadas. Apoio comercial e CTA da home atualizados; assinatura vermelha aplicada pontualmente.
- Rodapé com convite editorial e formulário em duas etapas. Etapa inicial: serviço e investimento opcional. Segunda: nome/e-mail obrigatórios, WhatsApp e descrição opcionais. Voltar preserva os dados; erros são anunciados e o foco aponta para o campo inválido.
- CTAs levam à âncora de contato. A rota /contato continua disponível com o mesmo formulário, sem repetição no rodapé. Fechar o menu devolve foco sem deslocar a página para longe da âncora.
- Serviços mantêm details/summary nativos, com teclado, estado expandido nativo, indicador +/×, destaque e chamada de contato.
- Rooftop continua como destaque e Simetria abre a seleção. Os cinco projetos, suas imagens, cores, natureza, créditos, contexto, desafio, objetivo, decisões, aplicações e resultados comprováveis foram preservados: a base já continha essa estrutura editorial. Não foram inventados resultados ou reescritas desnecessárias.
- Vídeos mantêm capas e controles, preload=none e reprodução por iniciativa do visitante. Removida a reprodução automática por interseção. Movimentos de entrada encurtados; conteúdo não fica oculto aguardando animações.
- Política de privacidade adicionada e incluída no sitemap. Não foram instaladas dependências adicionais.

## Contato e métricas

O serviço existente tem validação no servidor, honeypot, limite por remetente, deduplicação, destinatário fixo e confirmação por postMessage. O frontend continua utilizando esse contrato: converte duas opções para a lista aceita pelo serviço e inclui investimento, WhatsApp, descrição opcional, data ISO e origem no corpo estruturado da mensagem. Esses dados não são perdidos pelo serviço atualmente implantado. A descrição do visitante foi limitada a 750 caracteres para deixar espaço aos campos complementares dentro do limite de 1.200 do servidor.

Envio desabilita ações e campos; uma trava síncrona evita cliques duplicados. Tentativas repetidas com os mesmos dados mantêm o mesmo corpo para preservar a deduplicação do servidor. Erros/timeout não apagam os dados. A confirmação só aparece com origem Google confiável, identificador do protocolo e token da solicitação correspondente. Mantidos e-mail, cópia do briefing e rascunho EML como alternativas.

Eventos disponíveis pelo evento DOM `portfolio:analytics`, em `detail.event`: contact_form_view, contact_form_start, contact_step_1_complete, contact_step_2_view, contact_form_submit, contact_form_success e contact_form_error. Só carregam o nome do evento e a identificação fixa do formulário; não incluem dados pessoais. **Nenhum coletor persistente está conectado.**

## Evidências

- `node node_modules/next/dist/bin/next build`: build estático e TypeScript aprovados, 16 páginas geradas.
- `node --test tests/*.test.mjs`: 9 testes aprovados. Incluem rascunhos, todas as opções de serviço, opcionais vazios, transporte dentro do limite, validação/honeypot/deduplicação/limite por remetente e contraste dos tokens nos dois temas.
- Testes do backend executam o Code.gs existente em VM, com MailApp simulado. **Não são comprovação de entrega ao Gmail real.**
- `TEST_ORIGIN=http://127.0.0.1:3000 node tests/routes.mjs`: 71/71 rotas e arquivos aprovados. Corrigido o teste anterior que tratava pastas como arquivos e não percorria as mídias internas. Relatório: docs/validation/refinement-routes.json.
- Matriz de navegador em iframe de mesma origem: 10 páginas × 2 temas × 7 larguras (320, 375, 390, 430, 768, 1024, 1440), sem transbordamento horizontal. Isso mede largura real do documento; não equivale a testar aparelhos físicos.
- axe-core, regras wcag2a, wcag2aa, wcag21aa e wcag22aa: zero violações nas 10 páginas, nos dois temas, a 390 px, após estabilização dos estilos. Resultado bruto em docs/validation/refinement-browser.json. A automação não certifica conformidade integral: estados de menu, modal, erros e envio exigem revisão própria.
- Revisão manual no navegador: aparência clara/escura, preferência persistida, CTA até contato, erro de escolha obrigatória com foco, seleção por teclado, avanço sem investimento, erros de nome/e-mail, foco na pergunta e preservação de nome/e-mail ao voltar e avançar. Imagem em docs/screenshots/refinement/contact-light.png.

## Arquivos alterados

README.md; src/app/globals.css; src/app/layout.tsx; src/app/page.tsx; src/app/contato/page.tsx; src/app/sobre/page.tsx; src/app/sitemap.ts; src/app/privacidade/page.tsx (novo); src/components/contact.tsx; src/components/shell.tsx; src/components/case.tsx; src/lib/contact.mjs; tests/routes.mjs; tests/contact-delivery.test.mjs (novo); tests/theme-contrast.test.mjs (novo); este relatório e os arquivos de evidência citados.

## Pendências e publicação

1. Aprovação visual do proprietário, antes de qualquer publicação.
2. Teste ponta a ponta da nova interface com entrega efetiva no Gmail, incluindo confirmação do serviço e falha de rede no navegador. O código reutiliza o endpoint real, mas nenhuma mensagem de teste externa foi enviada nesta rodada local.
3. Lighthouse/Core Web Vitals não foram reexecutados nesta rodada. Métricas de campo exigem tráfego da versão publicada; os relatórios antigos do projeto não representam estas alterações.
4. Coleta persistente de conversões depende da escolha e conexão de uma ferramenta de métricas; nenhuma foi acrescentada implicitamente.
5. Publicação e revisão da versão pública continuam pendentes por instrução expressa do usuário.

## Ajuste solicitado: vermelho e interações

Aplicado #E50914 como acento exato nos dois temas. Em fundo escuro, esse vermelho atende ao contraste de elementos gráficos e texto grande, mas não ao mínimo de texto pequeno; por isso os rótulos pequenos continuam claros, com o vermelho nos traços, focos e indicadores. O texto sobre botões vermelhos usa #F8F9FA, com contraste de 4,55:1.

Novo src/app/interactions.css concentra tempos de 180–320 ms para controles e 700 ms para zoom discreto de imagens: preenchimento dos botões, sublinhados direcionais, indicadores dos cards e serviços, entrada/saída curta do menu, marcação dos campos e seleção leve do formulário. Sem efeitos que sigam o cursor; suporte a teclado e prefers-reduced-motion. As imagens mantêm as cores das marcas.

Validação desta rodada: build e 9 testes aprovados; foco do CTA, menu e transições revisados no navegador local. Os relatórios axe e de responsividade acima pertencem à rodada anterior, não foram refeitos integralmente para esta alteração. Publicação permanece pendente de aprovação visual.
