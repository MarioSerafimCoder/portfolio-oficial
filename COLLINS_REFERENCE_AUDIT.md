# Auditoria COLLINS — 18 de outubro de 2026

## Método e evidências

Navegação real no navegador, abertura/fechamento do menu, clique da listagem para Bose, abertura da narrativa em sobreposição, scroll e leitura de estilos computados. Visitadas home, /case-studies/, /case-studies/bose/, /programs/ e /arts-culture/. Capturas integrais das cinco páginas em 1440, 768 e 390 px em `docs/screenshots/reference/`, incluindo conteúdo intermediário e rodapé. As capturas de referência são documentação interna; nenhum asset será servido no portfólio.

## Observações e reprodução

| Elemento observado | Implementação própria |
| --- | --- |
| Base rgb(248,248,247); tinta rgb(20,7,0); branco rgb(255,255,255); neutro rgb(208,208,200); labels rgb(94,88,85) | Tokens semânticos, fundos claros/escuros alternados, tema persistente |
| Portrait Text nos títulos e Graphik na interface; H1 da home de 72px/72px a 1440; 36.8px no viewport estreito inicial | Instrument Serif OFL e DM Sans OFL, carregadas localmente; escala fluida aproximando proporções, sem baixar fontes comerciais da referência |
| Header desktop com logo à esquerda (~98px), botão de duas linhas à direita, altura 74px; logo central no mobile | Wordmark MÁRIO SERAFIM próprio, gutters fluidos, posicionamento responsivo e botão acessível |
| Hero central com enorme respiro; título em torno do centro vertical; reconhecimentos menores perto do final | Headline original; apresentação curta em lugar de prêmios; sem métricas inventadas |
| Menu cobre a tela com fundo vinho, links serifados grandes e CTA claro arredondado; parte editorial abaixo | Dialog de navegação com links próprios, travamento de scroll, foco contido, Escape e retorno de foco |
| Navegação mantém header; conteúdo atravessa estados de opacidade/esmaecimento antes de assentar | Transição de entrada por rota com opacity e deslocamento curto; sem copiar código proprietário |
| Programs combina título funcional pequeno com frase serifada e lista de ofertas | Quatro serviços com regras finas, nome, descrição e expansão por toque/teclado |
| Case Studies tem fundo escuro; quatro colunas com alturas e deslocamentos distintos no desktop, duas no mobile; Shelf/Spines fixos e busca | Galeria editorial com modos galeria/índice; filtro apenas com conteúdo real suficiente; cards com proporções variadas |
| Bose: label lateral, título na coluna direita, legenda sans, faixa de mídia horizontal com cantos arredondados; narrativa expandida sobre a página | Cases com cabeçalho editorial, galeria horizontal scroll-snap, narrativa em dialog, créditos, aplicações full-width e duas colunas |
| Arts & Culture usa labels pequenos, títulos serifados, mídia ampla e listas editoriais; home alterna para fundo escuro | Seção de pensamento com tipografia, processo e links para Sobre; sem criar blog fictício |
| Rodapé escuro alto, links serifados enormes, contato menor e utilitários na base | Rodapé com Projetos/Sobre/Contato, e-mail verificado, LinkedIn e controle de tema |
| Vídeos reais em reprodução e imagens de projeto no hero e nas galerias | Apenas mídia autorizada da pasta enviada pelo usuário, preload controlado e pausa acessível |

## Limites da inspeção

O navegador permite clique, scroll, screenshots e leitura de estilos, mas não expõe hover isolado. Não afirmamos ter verificado curva exata, duração ou biblioteca de hover da COLLINS. A alternativa própria é escala sutil da mídia, deslocamento da seta e sublinhado, com equivalência em focus-visible. Capturas integrais podem preservar conteúdo de mídia lazy antes de sua ativação; capturas intermediárias complementam os registros. Os arquivos capturam estados reais, e não uma reconstrução da referência.

A direção é uma adaptação individual: quatro serviços, dados biográficos comprováveis, nenhuma equipe ou premiação inventada, nenhuma fotografia pessoal. Não será reutilizado código, identidade, texto ou mídia da COLLINS nem do portfólio anterior. O diretório de trabalho estava vazio, sem Git ou infraestrutura prévia; iniciaremos histórico próprio na branch `rebuild/collins-editorial`.
