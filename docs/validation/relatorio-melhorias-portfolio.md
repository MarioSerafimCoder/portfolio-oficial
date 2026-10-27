# Relatório de melhorias do portfólio

**Data:** 26 de outubro de 2026  
**Site:** [marioserafim.com.br](https://marioserafim.com.br/)  
**Escopo:** direção de arte, 3D, motion design, navegação, acessibilidade e validação da publicação.

## Resultado

A abertura foi redesenhada sob o conceito “Percepção em movimento”. A elipse decorativa deu lugar a uma fita vermelha tridimensional, com espessura, torção, iluminação e sombra. Ela contracena com o título HTML “Identidade é percepção.” em planos visuais diferentes. O texto, o CTA e a navegação continuam disponíveis sem esperar pela animação.

A identidade existente foi preservada: assinatura de Mário Serafim, vermelho de acento, tipografia editorial, temas claro e escuro, conteúdo, projetos e fluxo de contato. A referência de Lando Norris serviu para orientar princípios de composição e narrativa; marca, linguagem e conteúdo do portfólio não foram copiados.

## Melhorias visuais e de interação

- **Hero 3D:** fita procedural renderizada em Three.js, com seção espessa, uma torção completa, material vermelho, luzes de preenchimento e contorno e sombra discreta. A composição posiciona a fita entre as linhas do título sem converter a tipografia em imagem ou canvas.
- **Resposta ao ponteiro:** em dispositivos com ponteiro preciso, a fita acompanha o movimento com inclinação limitada e amortecimento. Ela volta naturalmente à posição de repouso.
- **Continuidade no scroll:** uma timeline coordenada por GSAP e ScrollTrigger muda a orientação e a escala da fita, desloca o título e entrega a composição à primeira etapa de Amazonita. O scroll permanece nativo e não há pinning que retenha a pessoa em uma apresentação.
- **Amazonita:** textura, título e aplicação passam a ocupar planos independentes. A textura se revela sem deformar a rocha; o título e a aplicação percorrem distâncias menores e diferentes.
- **Rooftop e Simetria:** Rooftop organiza marca e aplicações por eixos, reforçando a linguagem arquitetônica. Simetria usa movimentos menores para relacionar retrato, texto e aplicação. O movimento foi concentrado nesses trabalhos para que cada projeto conserve seu próprio ritmo.
- **Header:** assinatura com mais presença, contato e menu mais claros, fundo translúcido e estado compacto após a rolagem. A altura externa permanece fixa para evitar deslocamento do conteúdo.
- **Menu:** prévia visual maior e atualizada ao passar o ponteiro ou mover o foco entre links. O fechamento por Escape, navegação por teclado e retorno de foco ao acionador foram mantidos.
- **Microinterações e composição:** CTA com magnetismo leve em desktop; hierarquia, sobreposições, respiros e escalas ajustados para dar contraste entre os momentos de impacto e as áreas de leitura.

## Implementação e decisões técnicas

- Adicionados **Three.js 0.186.1** e os tipos TypeScript correspondentes. A geometria é criada no próprio projeto; não foi necessário adicionar React Three Fiber nem um canvas por seção.
- **GSAP e ScrollTrigger** coordenam entrada, rolagem e transições. Uma configuração compartilhada limita DPR, inclinação, amortecimento e intensidade do movimento.
- A cena 3D é carregada sob demanda. A renderização pausa quando sai da viewport, quando a aba fica oculta ou quando não há movimento a processar. O renderer e os recursos gráficos são liberados no unmount.
- O SVG da fita aparece imediatamente como fallback; WebGL2 substitui o SVG quando a cena está pronta. Falha, perda ou restauração do contexto WebGL têm tratamento próprio.
- No celular, o fallback é exibido primeiro e a cena pesada só começa depois de interação ou rolagem. Tamanho do canvas e DPR são limitados.
- O projeto continua com Next.js e exportação estática. O scroll nativo foi mantido; Lenis não foi reintroduzido porque não havia benefício que justificasse adicionar outro controlador. Rive também não foi adicionado sem um asset ou interação que o exigisse. Webflow, jQuery e mudança de bundler ficaram fora do escopo.
- A integração existente de consentimento e analytics foi preservada. A validação local confirmou que recusar mantém analytics desligado e aceitar libera uma instância do GTM.

## Acessibilidade e responsividade

- Título, links, botões e conteúdo continuam no DOM semântico; a cena é decorativa e marcada como tal.
- O layout foi ajustado para celular, tablet e desktop em vez de apenas reduzir a composição. Foram inspecionadas larguras emuladas de 390, 768 e 1366 px.
- Hover tem alternativa de foco; o preview do menu acompanha foco e ponteiro. O menu permanece operável por teclado e toque.
- Com movimento reduzido, as animações são removidas ou simplificadas. Sem JavaScript, o título, links e SVG continuam visíveis. Sem WebGL, o SVG continua cobrindo a cena; perda e restauração de contexto também foram exercitadas.
- Os temas claro e escuro e o fluxo de consentimento foram verificados no preview. Não foram alteradas as escolhas de consentimento existentes.

## Verificações

- Build de produção estático: aprovado.
- TypeScript: aprovado.
- Suíte automatizada: **38 de 38 testes passaram**.
- Rotas e assets do export local: **523 de 523** com o resultado esperado.
- Produção: **16 de 16** páginas e assets principais responderam HTTP 200, incluindo início, projetos, blog, contato, privacidade, materiais, SVG, CSS e JavaScript.
- Inspeção visual em preview em larguras de celular, tablet e desktop; foram verificados o menu, foco, fallback sem WebGL, perda/restauração de contexto e conteúdo sem JavaScript.
- O Lighthouse foi executado uma vez em cada configuração publicada. Os valores são medições de laboratório e variam entre execuções.

| Medida | Produção anterior — desktop | Produção final — desktop | Produção anterior — celular | Produção final — celular |
|---|---:|---:|---:|---:|
| Performance Lighthouse | 0,99 | 0,99 | 0,84 | 0,89 |
| Acessibilidade Lighthouse | 1,00 | 1,00 | 0,96 | 1,00 |
| LCP | 778 ms | 828 ms | 3.959 ms | 3.487 ms |
| CLS | 0 | 0 | 0 | 0,000058 |
| TBT | 0 ms | 16,5 ms | 63 ms | 137 ms |
| Transferência medida | 679 KB | 819 KB | 664 KB | 717 KB |

No celular, o LCP medido melhorou cerca de 472 ms. No desktop, o score permaneceu em 0,99, com LCP cerca de 50 ms maior. A transferência medida subiu aproximadamente 139 KB no desktop e 53 KB no celular; esse custo acompanha os estilos e a experiência 3D. TBT é tempo de bloqueio em laboratório, **não é INP**. A avaliação não foi feita em aparelhos físicos.

## Publicação e arquivos

O código foi publicado no commit **2024a5b**. O registro dos testes em produção foi enviado em **622ae07**; a implantação mais recente do Cloudflare Pages está ativa e o domínio e o SVG final respondem HTTP 200.

Arquivos centrais:

- [Cena e geometria 3D](../../src/lib/ribbon-scene.ts)
- [Parâmetros de movimento](../../src/lib/perception-motion.ts)
- [Direção visual e responsividade](../../src/app/perception.css)
- [Hero e passagem para Amazonita](../../src/components/perception-hero.tsx)
- [Composição de Amazonita](../../src/components/amazonita-experience.tsx)
- [Coreografia de projetos](../../src/components/project-choreography.tsx)
- [Header e menu](../../src/components/shell.tsx)
- [Relatório de performance em JSON](./perception-performance.json)
- [Verificação de rotas e assets do export](./perception-routes.json)

Capturas: [desktop após as mudanças](../screenshots/perception-3d/after-1366.png), [celular com SVG](../screenshots/perception-3d/after-390-static.png), [celular com WebGL](../screenshots/perception-3d/after-390-webgl.png), [tablet](../screenshots/perception-3d/after-768.png), [fallback sem WebGL](../screenshots/perception-3d/fallback-no-webgl.png) e [conteúdo sem JavaScript](../screenshots/perception-3d/no-javascript.png).

## Limites da validação

Os tamanhos citados foram emulados no navegador; nenhum aparelho físico foi testado. A ferramenta de navegador disponível não permitiu gravar um vídeo da animação, portanto as capturas demonstram composição, e não fluidez. A varredura completa de rotas foi concluída no export local; em produção foram conferidos os 16 caminhos e assets principais, não os 523 em sequência. As notas e métricas do Lighthouse são execuções únicas, não dados de usuários reais.
