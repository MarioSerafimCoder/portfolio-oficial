# Direção de arte editorial — Identidade é percepção

Revisão de 26 de outubro de 2026. Implementação no Next.js 16.4.2 / React 19.3.1 existente.

## Auditoria e decisões

- A home anterior aplicava springs de ponteiro, WebGL contínuo, spatial motion e máscaras CSS. Os projetos apareciam em cartões com hierarquia semelhante e assinaturas frequentemente recortadas.
- Foram examinados a home publicada e o template Amazonita em desktop, tablet e mobile, nos temas existentes. As skills opcionais apple-design e emil-design-eng não foram encontradas no ambiente.
- Amazonita abre a seleção com fotografia real da matéria-prima em grande escala e uma segunda imagem da aplicação digital. Rooftop usa texto e assinatura em colunas de pesos diferentes, acompanhados de uma peça editorial. Simetria usa retrato, texto deslocado e aplicação em bolsa. Eduardo Noronha e Amanda Araújo encerram a seleção em duas colunas alinhadas.
- As imagens são do acervo existente. Nenhuma marca, fotografia, resultado, cliente ou informação comercial foi criado. A fotografia da matéria tem largura máxima de 1160px e zoom limitado, compatível com o original de 1280px.
- A primeira imagem dos cases agora exibe a assinatura completa; as superfícies deixam de inclinar com o scroll. O conteúdo, as galerias, os vídeos, as setas do rail e os CTAs dos cases permanecem disponíveis.

## Componentes e responsabilidades

- `src/components/perception-hero.tsx`: abertura GSAP, com SVG vermelho como moldura do olhar; substitui `hero-depth.tsx` e `identity-sculpture.tsx`.
- `src/components/amazonita-experience.tsx`: experiência editorial ligada ao scroll, usando ScrollTrigger.
- `src/components/editorial-projects.tsx`: composição dos cinco projetos com imagens existentes, textos semânticos e links explícitos.
- `src/app/editorial.css`: grid, escalas tipográficas, estados de foco, temas, proporções e adaptações dos cases.
- `src/app/page.tsx` e `src/app/layout.tsx`: integração dos componentes e estilos.
- `src/components/chapter-reveals.tsx`: exclui elementos com proprietário de motion próprio, evitando animações concorrentes na composição editorial.
- `scripts/preview-export.mjs`: servidor de revisão local da exportação estática, com compressão e opção `?review-no-js=1` para conferir o HTML sem scripts. Não integra a publicação.

## As duas experiências GSAP

1. Abertura de aproximadamente 1,3s: linhas reais avançam com deslocamento e máscara curta; a moldura vermelha atravessa a composição e se estabiliza. O CTA é renderizado imediatamente. Rolar além de 80px conclui a abertura. Sem loading, captura de scroll, cursor especial ou loop contínuo.
2. Amazonita: máscara passa de um enquadramento levemente fechado ao quadro integral, com zoom de 1,065 para 1 no desktop e 1,025 para 1 no mobile. A legenda acompanha com deslocamento pequeno. A sequência usa scrub, sem pin e sem scroll horizontal. O estado final permite entrar no projeto normalmente.

`useGSAP` e `gsap.matchMedia` revertem contextos em desmontagem e mudanças de breakpoint. `prefers-reduced-motion` elimina as sequências. O HTML e o CSS não ocultam conteúdo por padrão: sem JavaScript, título, projetos e links permanecem visíveis. O antigo canvas WebGL e seu loop foram removidos.

## Avaliação Lenis

Após concluir as duas experiências, Lenis 1.3.27 foi instalado temporariamente em desenvolvimento. O cenário B utilizou o CSS oficial, `anchors: true`, `lenis.on('scroll', ScrollTrigger.update)` e o ticker GSAP como único driver (`autoRaf: false`). O componente de avaliação e a dependência foram removidos ao concluir.

Amostras de 1,8s com rolagem automatizada no mesmo navegador e máquina:

| Viewport | Rolagem | P95 entre quadros | Quadros acima de 25ms |
| --- | --- | --- | --- |
| Desktop | Nativa | 8,4ms | 1 |
| Desktop | Lenis | 8,5ms | 0 |
| Mobile emulado | Nativa | 8,5ms | 0 |
| Mobile emulado | Lenis | 8,4ms | 0 |

Não houve ganho consistente que justificasse a dependência, o ticker adicional ou mais coordenação com menu e navegação. Foram conferidos scroll reverso, âncoras e abertura/fechamento do menu. **Decisão: manter rolagem nativa.** Estas amostras não são um benchmark estatístico e não substituem testes físicos de trackpad ou touch.

Referências de implementação: [GSAP em React](https://gsap.com/resources/React/), [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [integração oficial Lenis](https://github.com/darkroomengineering/lenis).

## Dependências

Adicionadas: `gsap` 3.15.0 e `@gsap/react` 2.1.2. Lenis foi removido após avaliação. Three.js e Rive não foram adicionados: a narrativa foi resolvida com texto real, SVG, CSS e GSAP.

## Validação

- `pnpm check`: sem erros de TypeScript.
- `pnpm test`: 30 testes aprovados, incluindo formulário/backend simulado, consentimento, publicação do blog, motion e contraste dos temas.
- `pnpm build`: 25 páginas exportadas com sucesso. Não há script de lint configurado no repositório.
- `TEST_ORIGIN=http://127.0.0.1:3003 node tests/routes.mjs`: 522/522 rotas e arquivos com status esperado.
- Navegador interno: larguras 390, 768, 1366, 1440 e 1920; temas claro/escuro; home e case Amazonita; scroll rápido/reverso; navegação interna ao blog e retorno; menu; âncoras; seleção de serviço e avanço do formulário até a segunda etapa, sem enviar uma solicitação real.
- Fallback sem scripts: headline e os cinco projetos visíveis; 0 scripts e ausência de overflow horizontal na revisão mobile.
- Lighthouse local com exportação comprimida: desktop 100 desempenho / 100 acessibilidade / 100 boas práticas / 100 SEO; mobile com flag de movimento reduzido 89 / 100 / 100 / 100. CLS 0 em ambos; LCP 0,76s desktop e 3,77s mobile simulado; TBT 0ms e 50,5ms. São medições de laboratório local, não dados de usuários reais.
- Capturas em `docs/screenshots/editorial/`, incluindo referência anterior, abertura nos dois temas, tablet, mobile e composições dos projetos.

## Limites

Sem dispositivos físicos de touch/trackpad ou Safari disponíveis nesta sessão. A auditoria automatizada de acessibilidade não substitui uma avaliação com leitor de tela. Nenhuma mensagem de teste foi enviada pelo formulário.
