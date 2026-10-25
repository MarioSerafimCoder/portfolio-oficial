# Refinamento final de UI/UX e movimento — 25/10/2026

Implementação sobre `ea729aa`, conforme o briefing final. Direção de arte, fontes, paleta, cases, URLs, integrações e infraestrutura do blog preservados.

## Referência e decisões

Antes de alterar o código, foram percorridas as quatro páginas principais de [Lando Norris](https://landonorris.com/): Home, On Track, Off Track e Calendar; também menu, galerias, acordeões, rodapé e hero mobile. A leitura orientou profundidade em camadas, variação de ritmo entre seções e protagonismo das imagens. Não foram reproduzidos assets, identidade automobilística ou rolagem capturada.

Skills aplicadas: `F:/lastro/.agents/skills/apple-design/SKILL.md` e `F:/lastro/.agents/skills/emil-design-eng/SKILL.md`. Springs existentes preservam velocidade; resposta ao teclado é imediata, mouse e toque recebem comportamentos adequados e movimento reduzido continua respeitado.

| Antes | Depois | Por quê |
| --- | --- | --- |
| Serviços antes dos trabalhos; duas seções de processo | Projetos logo após hero; processo único em Entender, Definir e Construir | Evidenciar trabalhos e reduzir repetição |
| Entrada semelhante entre blocos | Hero em profundidade; abertura de imagem nos projetos; entrada lateral nos serviços; linhas e texto sequenciados no processo | Criar ritmo com movimentos discretos e relacionados ao conteúdo |
| Teclado desativava todas as animações globalmente | Feedback imediato restrito aos controles e itens focados | Preservar navegação acessível sem desativar a apresentação inteira |
| Imagens originais para todos os dispositivos | Sete tamanhos WebP produzidos no build e srcset compatível com exportação estática | Reduzir transferência sem serviço adicional |
| Conteúdo completo dos cases serializado pela home | Componente de card isolado recebe apenas os dados necessários | Diminuir HTML e dados enviados na primeira renderização |
| Legenda sobre a Amazonita e enquadramento problemático do Rooftop | Legenda externa à obra; enquadramento proporcional da capa do case | Melhor leitura sem alterar trabalhos originais |
| Navegação principal concentrada no menu | Projetos e Contato no desktop; Contato no mobile | Acesso rápido mantendo menu editorial |
| Setor e orçamento na primeira etapa | Apenas escolha do serviço; dados pessoais na segunda etapa | Menos atrito, com backend e validações preservados |
| Atalho flutuante próximo ao FAQ | Oculto enquanto FAQ, CTA ou formulário estão visíveis | Evitar sobreposição em telas pequenas |

## Performance e arquitetura

- 54 imagens recebem sete variantes cada. Sharp já era dependência transitiva; agora é uma dependência explícita de desenvolvimento para gerar os arquivos.
- Amazonita: original 330.788 bytes; variante de 960 px com 73.532 bytes (77,8% menor). Rooftop: 41.300 para 11.802 bytes; Simetria: 88.320 para 33.742 bytes. Não representam o peso total da página.
- HTML da home caiu de aproximadamente 68 KB na versão intermediária para 57.454 bytes após separar os dados dos cards.
- CSS da home consolidado, tokens duplicados removidos e entradas que diminuíam a opacidade do conteúdo inicial eliminadas.
- Fontes locais WOFF2 e font-display swap preservados; não se atribui ganho a alterações de fontes inexistentes.
- Prefetch automático do atalho Projetos desativado para evitar trabalho fora da primeira tela.
- Hero só agenda atualização de scroll enquanto visível; não captura a rolagem. Pointer spring exige mouse de precisão. Sem nova biblioteca de animação.

## Validação

- TypeScript aprovado; 27/27 testes passaram; build de produção gerou 25 páginas.
- 522/522 verificações locais de páginas e arquivos passaram, incluindo variantes responsivas.
- Revisão visual em navegador a 1440, 768, 390 e 320 px, claro/escuro; menu e retorno do foco com Escape; FAQ/serviços; cards e Rooftop; formulário em duas etapas com validação e preservação ao voltar.
- Sem overflow horizontal nos tamanhos revisados; capa do Rooftop conferida novamente a 320/768 px.
- Movimento reduzido revisado; testes de spring existentes cobrem 30/60/120 fps.
- Nenhum e-mail real enviado durante QA. Testes de viewport não equivalem a teste em aparelho físico.
- git diff --check sem erros.

## Medições de laboratório

Referência anterior: local mobile 76 / LCP 6,8 s; local desktop 97 / LCP 1,2 s. Produção anterior (arquivo tmp/refinement-production.json): mobile 85 / LCP 4,1 s, acessibilidade/boas práticas/SEO 100, CLS 0.

A medição final no domínio oficial será registrada após a conclusão do deploy. Resultados locais sem compressão não devem ser comparados diretamente com produção. Metas de 90+ e LCP abaixo de 2,5 s só serão consideradas alcançadas quando medidas.
