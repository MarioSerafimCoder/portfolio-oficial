# Reveals por capítulo — 26/10/2026

Header e escultura WebGL preservados. Referência visual: máscaras, ritmo editorial e entradas sequenciais observados no site Lando Norris; sem copiar imagens ou bloquear a rolagem.

| Antes | Depois | Por quê |
| --- | --- | --- |
| Entradas discretas e repetidas | Títulos com máscara vertical e linhas sequenciais | Tornar a chegada de cada capítulo perceptível |
| Imagens quase estáticas | Aberturas inferior, lateral e central, com aproximação | Variar a composição mantendo a fotografia protagonista |
| Serviços uniformes | Linha vermelha desenhada, número girando, título lateral | Construir cada serviço em etapas |
| Processo pouco expressivo | Palavras acompanhando a rolagem e etapas sequenciais | Relacionar movimento à leitura |
| Internas com ritmo semelhante | Paletas desdobradas, listas alternadas, FAQ horizontal, formulário vertical | Dar identidade a cada tipo de conteúdo |

## Implementação

ChapterReveals classifica o DOM existente e aplica estados waiting/entering/done. Animações de 850–1400 ms, stagger limitado a 225 ms. Um requestAnimationFrame agrupa leituras de posição e escritas; sem trabalho contínuo após todas as entradas. MutationObserver registra conteúdo de filtros e navegação. Sem novas dependências.

Rolagem nativa, HTML sem JavaScript visível, foco e âncoras expõem imediatamente o conteúdo. Preferência por movimento reduzido e impressão desativam máscaras. Header, hero e menu excluídos. Nenhum envio de formulário realizado nos testes.

## Verificação

- TypeScript, 27 testes e build de 25 páginas aprovados.
- Revisão visual da home, serviços, palavras do processo, FAQ, Sobre a 320px, Rooftop a 768px, filtros de Projetos a 390px, contato por âncora e Blog em tema claro.
- Estados finais sem elementos aguardando reveal dentro da área visível; sem overflow nas verificações responsivas.
- Foco de teclado nos cards expõe também suas imagens.
- Lighthouse local desktop com movimento reduzido: performance 97, acessibilidade 100, boas práticas 100, SEO 100. Medição de laboratório, não dados reais de visitantes.
