# Revisão espacial — 25/10/2026

Revisão após feedback de que a apresentação anterior estava discreta e as internas monótonas. Mantidas identidade, conteúdo, obras originais e integrações.

| Antes | Depois | Motivo |
| --- | --- | --- |
| Traços quase imperceptíveis na hero | Escultura vermelha em WebGL, malha toroidal com iluminação difusa/especular, rotação e resposta ao cursor | Volume tridimensional visível e um foco visual além da tipografia |
| Cases com títulos pequenos e imagens estáticas | Títulos de escala editorial, trilho em perspectiva, planos em diferentes posições e galerias que se abrem durante a rolagem | Ritmo próprio para apresentação dos projetos |
| Cards com zoom apenas | Inclinação em dois eixos com springs independentes e entradas alternadas | Resposta espacial ao mouse, sem salto ao redirecionar |
| Sobre com entradas uniformes | Capítulos, numeração expressiva, entradas laterais alternadas e elemento tipográfico em parallax | Diferenciar a narrativa pessoal dos cases |
| Blog/contato com pouca apresentação | Abertura do título e linhas sequenciadas no blog; plano de entrada do formulário | Continuidade de movimento nas páginas internas, preservando a leitura |

A escultura usa WebGL nativo, uma malha e uma chamada de desenho, sem bibliotecas ou arquivos externos. Pixel ratio limitado a 1,5. Renderização para fora da tela e com a aba oculta; movimento reduzido desenha uma composição estática. O título permanece HTML. Sem WebGL, o conteúdo e as ações continuam disponíveis.

O controlador de rolagem usa observação de interseção, atualiza superfícies visíveis e registra cards recriados por filtros. Rolagem nativa preservada. Modo de movimento reduzido remove perspectiva/parallax animados; teclado mantém feedback e restauração do foco.

Validação: TypeScript, 27 testes e build de 25 páginas aprovados. Revisão no navegador de hero em claro/escuro e 1440/390/320 px; galeria filtrada a 768 px; cases em desktop/320 px; Sobre, Contato e Blog; Escape devolve foco ao menu. Sem overflow horizontal nos tamanhos inspecionados. Confirmadas matrizes 3D diferentes durante a rolagem e renderização do canvas. Lighthouse local desktop com movimento reduzido: performance 98, acessibilidade/boas práticas/SEO 100, LCP 1,2 s e auditoria de erros do console aprovada.

As medições de produção do relatório anterior pertencem à versão anterior. A versão espacial terá sua própria medição após publicação.
