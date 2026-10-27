# Refinamento espacial e motion design — 27/10/2026

## Resultado visual

A fita vermelha agora participa de uma composição maior, com tipografia em planos diferentes, material acetinado e curvas discretas que continuam até os projetos. Amazonita, Rooftop, Simetria e os projetos de encerramento recebem tratamentos distintos. Serviços respondem à seleção, o processo ganhou um percurso e o contato encerra a página em uma atmosfera verde profunda, retomando a curva da abertura.

Não foram adicionadas dependências. A implementação usa Three.js, GSAP/ScrollTrigger, SVG, CSS e Web Animations API já disponíveis no navegador. O scroll continua nativo, sem pinning. Não houve geração paga, envio de assets privados para ferramentas externas ou criação de versões fictícias dos projetos.

## Inventário de movimento e conflitos corrigidos

| Sistema anterior | Problema | Tratamento nesta etapa |
|---|---|---|
| ChapterReveals | Seletores globais aplicavam máscaras a títulos, parágrafos, FAQ, serviços, formulário e rodapé | Removida a aplicação indiscriminada. Restam entradas curtas em superfícies visuais selecionadas, sem ocultar toda a imagem |
| PerceptionHero | O transform no contêiner do título criava um stacking context e anulava a separação dos planos | Scroll aplicado diretamente às linhas. Uma única cena WebGL fica entre os planos HTML do título |
| AmazonitaExperience | Movimento existente com pouca relação entre cartaz e aplicação | Mantido um proprietário por propriedade: hero controla escala do palco; Amazonita controla textura, título e aplicação |
| ProjectChoreography | Deslocamentos parecidos, concentrados em entrada vertical | Rooftop trabalha por eixos, Simetria por contraponto e a dupla final por pequenos ajustes de escala e orientação |
| SpatialMotion | Efeitos globais de outras páginas poderiam competir com a home | Os componentes da home têm responsabilidade e escopo explícitos; os efeitos das outras rotas não controlam essas superfícies |
| Services e FAQ | Dependência de reveals ao entrar na viewport | Interação voluntária em details/summary nativos; abertura e fechamento de altura em 320 ms, com limpeza no unmount |

## Intenção por seção

| Trecho | Movimento e composição | Conteúdo estável e término |
|---|---|---|
| Hero | Fita maior, enquadramento e curvas de fundo; inclinação amortecida; mudança de orientação e escala ao rolar | Título e CTA aparecem imediatamente. Identificação e CTA estão acima da cena; as linhas mantêm planos próprios |
| Introdução aos projetos | Gesto vermelho acompanha a palavra “estética”; curvas do fundo deslocam-se lentamente | Texto e controles permanecem legíveis. O gesto termina desenhado antes da leitura central da seção |
| Amazonita | Textura, título e aplicação em planos independentes; aplicação sobrepõe parte inferior da pedra | Rocha e marca não são deformadas. Descrição e CTA concluem a composição fora da sobreposição |
| Rooftop | Eixos, moldura estrutural, marca e aplicação organizam-se horizontalmente | Nova capa mostra a assinatura real, sem cabeçalhos e rodapés do manual. A aplicação não cobre a marca; crédito de arquitetura permanece |
| Simetria | Retrato e aplicação seguem deslocamentos opostos e pequenos; círculo estrutural e sobreposição controlada | Rosto, marca, texto e CTA preservados |
| Eduardo e Amanda | Dupla coordenada com tempos ligeiramente diferentes; ajustes discretos de escala e orientação | Hover e foco individuais já existentes foram preservados; menor intensidade que os projetos principais |
| Serviços | Seleção expande a descrição e troca uma prévia. No celular, a prévia fica dentro do item aberto | Imagens reais de Rooftop/Amazonita; Branding usa composição tipográfica e vetorial, sem atribuir um trabalho fictício |
| Processo | Linha conecta Entender, Definir e Construir e o scroll destaca uma etapa | Todos os textos permanecem visíveis. Três colunas no desktop e sequência vertical compacta no celular |
| FAQ | Altura e ícone acompanham abertura/fechamento; perguntas seguintes se reposicionam | Área de leitura tranquila, sem entrada decorativa em cada pergunta |
| Contato e rodapé | Mudança de atmosfera, tipografia maior e fragmento vetorial da linguagem da fita | Formulário em superfície estável, sem canvas ou renderização pesada por trás |
| Header/menu | Compactação preservada, fundo refinado e transição suave das prévias; Rooftop usa a capa nova | Destinos, Escape e retorno de foco preservados |

Com movimento reduzido, as timelines de scroll são dispensadas, as descrições usam o comportamento nativo e o hero conserva a escultura estática. Textos e CTAs permanecem disponíveis.

## Correções mobile e assets

- A identificação pequena ganhou área própria acima da fita, sem sobreposição.
- Escala e enquadramento mudam por breakpoint. A página foi inspecionada em 390 × 844, 768 × 1024, 1366 × 768 e 1440 × 900, em viewport emulada.
- O WhatsApp flutuante deixa de aparecer no celular. Os links de contato continuam no hero e no rodapé. Em desktop, a regra também considera hero, Amazonita, FAQ, formulário e banner de consentimento.
- A capa `rooftop-home.webp` foi criada por recorte do asset real existente com Sharp; o case mantém as páginas completas. Variantes responsivas são geradas pelo script de imagens já existente.
- `perception-curves.svg`, gesto da palavra “estética”, composição de Branding e fragmento de encerramento foram construídos em SVG/CSS. Não foi necessário vídeo opcional nem ferramenta generativa.

## Arquitetura e carregamento

- `scenography.css`: composição, planos, áreas seguras, temas locais e breakpoints.
- `home-narrative.tsx`: gesto da introdução e curvas de fundo, com escopo e cleanup.
- `perception-hero.tsx` e `ribbon-scene.ts`: camadas DOM/canvas, material acetinado, iluminação mais suave e transformação no scroll.
- `services.tsx`: prévias por serviço; `quiet-disclosures.tsx`: expansão de altura sem substituir a semântica de details/summary.
- `process-steps.tsx`: percurso visual e atualização direta do destaque, sem estado React por frame.
- `chapter-reveals.tsx` e `reveals.css`: substituição dos reveals globais por entradas breves e seletivas.
- A cena 3D mantém carregamento progressivo, limites de DPR, pausa fora da tela/aba oculta, renderização parada em repouso, descarte dos recursos e recuperação de contexto.
- Fontes serifadas do título mantêm prioridade. Pesos da fonte de apoio são requisitados conforme o uso, sem preloads globais de todos eles.
- Lenis e Rive não foram adicionados: a implementação funciona com scroll nativo e SVG, sem necessidade de outro controlador ou asset Rive. Next.js, bundler, hospedagem e integração analítica foram preservados.

## Validação registrada

- `pnpm test`: 38/38 testes passaram.
- `pnpm run check`: aprovado.
- `pnpm run build`: export estático aprovado.
- Rotas e arquivos do export: 533/533 com o resultado esperado; dados em `spatial-refinement-routes.json`.
- Menu aberto/fechado, Escape e retorno de foco verificados. Prévia de serviço, FAQ e navegação para Simetria e retorno à home exercitados.
- Formulário avançou da escolha de tipo para os campos de contato, sem preenchimento ou envio de mensagem de teste.
- Claro/escuro, notebook de menor altura e áreas seguras mobile inspecionados. Nenhum overflow horizontal nas larguras registradas.
- Sem WebGL: fallback visível e título preservado. Perda e restauração de contexto: retorno ao SVG e recuperação do canvas confirmados, sem erro de console registrado nessa verificação.
- Sem JavaScript: 49 links, título HTML, conteúdo e fallback disponíveis; nenhuma máscara de conteúdo pendente.
- Consentimento em origens locais isoladas: antes da escolha, nenhum script analítico; após recusa e reload, nenhum script; após aceite, uma única Google tag. Escolhas do domínio público não foram modificadas.

## Performance

O arquivo `spatial-refinement-performance.json` registra as medições de laboratório e de produção. As amostras são pontuais; TBT não representa INP.

| Desktop | Release anterior | Export local final | Produção final |
|---|---:|---:|---:|
| Performance Lighthouse | 0,99 | 1,00 | 1,00 |
| Acessibilidade | 1,00 | 1,00 | 1,00 |
| LCP | 802 ms | 692 ms | 672 ms |
| CLS | 0 | 0 | 0 |
| TBT | 8 ms | 58 ms | 6 ms |
| Transferência | 819 KB | 773 KB | 784 KB |

| Mobile | Release anterior | Export local final | Produção final |
|---|---:|---:|---:|
| Performance Lighthouse | 0,87 | 0,86 | 0,79 |
| Acessibilidade | 1,00 | 1,00 | 1,00 |
| LCP | 3.303 ms | 4.006 ms | 2.622 ms |
| CLS | 0 | 0 | < 0,001 |
| TBT | 237 ms | 45 ms | 623 ms |
| Transferência | 682 KB | 634 KB | 637 KB |

No domínio público, a amostra desktop subiu para 1,00, com LCP de 672 ms. No celular, três medições no release final ficaram em 0,79, LCP de 2.608–2.646 ms e TBT de 585–623 ms. Em relação à versão anterior, LCP e transferência mobile melhoraram, mas o score caiu e o TBT aumentou; por isso não classifico o desempenho mobile geral como uma melhoria. Uma tentativa de adiar a cena Three no celular não trouxe ganho consistente e foi revertida para preservar sua interação 3D. A comparação de produção está em `spatial-refinement-performance.json`; a origem local e a pública têm infraestruturas distintas.

## Implantação pública

Na validação, o Cloudflare Pages confirmou o release `a010b51` ativo em `main`; a implementação visual está no commit `98b728b`. A home e as rotas de Rooftop, Simetria e contato, além de `perception-curves.svg` e `rooftop-home.webp`, responderam com HTTP 200. Acessibilidade Lighthouse ficou em 1,00 em desktop e mobile.

## Evidências e limites

Capturas antes/depois em `docs/screenshots/spatial-refinement/`, incluindo hero desktop/mobile, tablet claro/escuro, Amazonita, Rooftop, Simetria, serviços, processo, menu, contato e fallbacks.

Todos os tamanhos foram emulados; não houve teste em aparelho físico. A API de navegador utilizada não ofereceu gravação de vídeo. Screenshots registram composição e estados, sem comprovar por si sós fluidez. Não foi medido INP com usuários reais.

As alterações locais independentes em Cloudflare, testes do publicador, conteúdo gerado e o relatório da etapa anterior foram preservadas e não integram esta publicação.
